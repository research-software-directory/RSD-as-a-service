// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Throttler;
import nl.esciencecenter.rsd.scraper.Utils;

class OpenAlexConnector {

	private static final String DOI_FILTER_URL_UNFORMATTED = "https://api.openalex.org/works?filter=doi:%s";
	private static final String OPENALEX_ID_URL_UNFORMATTED = "https://api.openalex.org/works?filter=ids.openalex:%s";
	private static final String OPENALEX_CITES_URL_UNFORMATTED = "https://api.openalex.org/works?filter=cites:%s";
	// https://docs.openalex.org/how-to-use-the-api/rate-limits-and-authentication
	// The docs and empirical experiments indicate 10 requests per second.
	// We make it slightly lower to be safe.
	private static final Throttler apiThrottler = new Throttler(9, 1050, TimeUnit.MILLISECONDS);

	private static String doOpenAlexGetRequest(String url)
		throws IOException, InterruptedException, RsdResponseException {
		Objects.requireNonNull(url);

		String email = Config.crossrefContactEmail().orElse(null);

		apiThrottler.awaitPermission();
		HttpResponse<String> response = email == null
			? Utils.getAsHttpResponse(url)
			: Utils.getAsHttpResponse(url, "User-Agent", "mailto:" + email);

		if (response.statusCode() == 200) {
			return response.body();
		} else {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				response.body(),
				"Unexpected response on GET request to OpenAlex"
			);
		}
	}

	public Optional<OpenalexId> getOpenAlexIdFromDoi(Doi doi)
		throws RsdResponseException, IOException, InterruptedException {
		if (doi == null) {
			return Optional.empty();
		}

		Collection<ExternalMentionRecord> harvestedMention = mentionDataByDois(List.of(doi));
		if (harvestedMention.isEmpty()) {
			return Optional.empty();
		}

		return Optional.of(harvestedMention.iterator().next().openalexId());
	}

	public Collection<ExternalMentionRecord> mentionDataByDois(Collection<Doi> dois)
		throws IOException, InterruptedException, RsdResponseException {
		if (dois == null || dois.isEmpty()) {
			return Collections.emptyList();
		}

		String filter = dois.stream().filter(Objects::nonNull).map(Doi::toString).collect(Collectors.joining("|"));
		// e.g. https://api.openalex.org/works?filter=doi:10.1038%2Fs41598-024-73248-4|10.5194%2Ftc-2022-249-rc1&per-page=200
		String worksUri = DOI_FILTER_URL_UNFORMATTED.formatted(Utils.urlEncode(filter)) + "&per-page=200";

		String responseBody = doOpenAlexGetRequest(worksUri);

		JsonObject tree = JsonParser.parseString(responseBody).getAsJsonObject();
		JsonArray mentionsArray = tree.getAsJsonArray("results");

		Collection<ExternalMentionRecord> mentions = new ArrayList<>();
		for (JsonElement mention : mentionsArray) {
			ExternalMentionRecord citationAsMention;
			try {
				citationAsMention = parseAsMention(mention);
			} catch (RuntimeException e) {
				Utils.saveExceptionInDatabase("OpenAlex mention scraper", "mention", null, e);
				continue;
			}
			mentions.add(citationAsMention);
		}

		return mentions;
	}

	public Collection<ExternalMentionRecord> mentionDataByOpenalexIds(Collection<OpenalexId> openalexIds)
		throws IOException, InterruptedException, RsdResponseException {
		if (openalexIds == null || openalexIds.isEmpty()) {
			return Collections.emptyList();
		}

		String filter = openalexIds
			.stream()
			.filter(Objects::nonNull)
			.map(OpenalexId::getOpenalexKey)
			.collect(Collectors.joining("|"));
		// e.g. https://api.openalex.org/works?filter=ids.openalex:W4402994101|W4319593220&per-page=200
		String worksUri = OPENALEX_ID_URL_UNFORMATTED.formatted(Utils.urlEncode(filter)) + "&per-page=200";

		String responseBody = doOpenAlexGetRequest(worksUri);

		JsonObject tree = JsonParser.parseString(responseBody).getAsJsonObject();
		JsonArray mentionsArray = tree.getAsJsonArray("results");

		Collection<ExternalMentionRecord> mentions = new ArrayList<>();
		for (JsonElement mention : mentionsArray) {
			ExternalMentionRecord citationAsMention;
			try {
				citationAsMention = parseAsMention(mention);
			} catch (RuntimeException e) {
				Utils.saveExceptionInDatabase("OpenAlex mention scraper", "mention", null, e);
				continue;
			}
			mentions.add(citationAsMention);
		}

		return mentions;
	}

	public Collection<ExternalMentionRecord> citations(OpenalexId openalexId, UUID id)
		throws IOException, InterruptedException, RsdResponseException {
		// This shouldn't happen, but let's check it to prevent unexpected exceptions:
		if (openalexId == null) {
			return Collections.emptyList();
		}

		String citationsUri = citationsUri(openalexId);
		return scrapeCitations(citationsUri, id);
	}

	// https://docs.openalex.org/api-entities/works/filter-works#cites
	static String citationsUri(OpenalexId openalexId) {
		Objects.requireNonNull(openalexId);
		return OPENALEX_CITES_URL_UNFORMATTED.formatted(openalexId.getOpenalexKey());
	}

	// we use cursor paging as that will always work
	// https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/paging#cursor-paging
	// the id parameter is used only for logging exceptions
	static Collection<ExternalMentionRecord> scrapeCitations(String citationsUri, UUID id)
		throws IOException, InterruptedException, RsdResponseException {
		final int perPage = 200;
		String cursor = "*";

		Collection<ExternalMentionRecord> citations = new ArrayList<>();
		while (cursor != null) {
			String citationsUriWithCursor = citationsUri + "&per-page=" + perPage + "&cursor=" + cursor;
			String responseBody = doOpenAlexGetRequest(citationsUriWithCursor);
			JsonObject tree = JsonParser.parseString(responseBody).getAsJsonObject();

			cursor = Utils.stringOrNull(tree.getAsJsonObject("meta").get("next_cursor"));

			JsonArray citationsArray = tree.getAsJsonArray("results");

			for (JsonElement citation : citationsArray) {
				ExternalMentionRecord citationAsMention;
				try {
					citationAsMention = parseAsMention(citation);
				} catch (RuntimeException e) {
					Utils.saveExceptionInDatabase("Citation scraper", "mention", id, e);
					continue;
				}
				citations.add(citationAsMention);
			}
		}

		return citations;
	}

	static ExternalMentionRecord parseAsMention(JsonElement element) {
		JsonObject citationObject = element.getAsJsonObject();

		String doiUrl = Utils.stringOrNull(citationObject.get("doi"));
		String doiString = doiUrl;
		if (doiString != null) {
			doiString = doiString.replace("https://doi.org/", "");
		}
		Doi doi = doiString == null ? null : Doi.fromString(doiString);

		URI url;
		if (doiUrl != null) {
			url = URI.create(doiUrl);
		} else {
			JsonArray locations = citationObject.getAsJsonArray("locations");
			url = extractUrlFromLocation(locations);
		}

		String title = Utils.stringOrNull(citationObject.get("title"));
		if (title == null) {
			String openAlexId = citationObject.getAsJsonPrimitive("id").getAsString();
			String message = "The title of the mention with DOI %s and OpenAlex ID %s is null".formatted(
				doiString,
				openAlexId
			);
			throw new RuntimeException(message);
		}

		JsonArray authorsArray = citationObject.getAsJsonArray("authorships");
		String authors = StreamSupport.stream(authorsArray.spliterator(), false)
			.map(JsonElement::getAsJsonObject)
			.map(jo -> jo.get("raw_author_name"))
			.filter(Predicate.not(JsonElement::isJsonNull))
			.map(JsonElement::getAsString)
			.collect(Collectors.joining(", "));
		if (authors.isBlank()) {
			authors = null;
		}

		Integer publicationYear = Utils.integerOrNull(citationObject.get("publication_year"));

		String crossrefType = Utils.stringOrNull(citationObject.get("type_crossref"));
		MentionType mentionType = CrossrefMention.crossrefTypeMap.getOrDefault(crossrefType, MentionType.other);

		String openalexIdString = citationObject.getAsJsonObject("ids").getAsJsonPrimitive("openalex").getAsString();
		OpenalexId openalexId = OpenalexId.fromString(openalexIdString);

		return new ExternalMentionRecord(
			doi,
			null,
			openalexId,
			url,
			title,
			authors,
			null,
			publicationYear,
			null,
			null,
			mentionType,
			"OpenAlex",
			null
		);
	}

	static URI extractUrlFromLocation(JsonArray locations) {
		if (locations == null) {
			return null;
		}

		for (JsonElement location : locations) {
			JsonObject locationObject = location.getAsJsonObject();
			String landingPageUrl = Utils.stringOrNull(locationObject.get("landing_page_url"));
			if (landingPageUrl != null) {
				landingPageUrl = landingPageUrl.replace("\\", "%5C");
				return URI.create(landingPageUrl);
			}

			String pdfUrl = Utils.stringOrNull(locationObject.get("pdf_url"));
			if (pdfUrl != null) {
				return URI.create(pdfUrl);
			}
		}

		return null;
	}
}
