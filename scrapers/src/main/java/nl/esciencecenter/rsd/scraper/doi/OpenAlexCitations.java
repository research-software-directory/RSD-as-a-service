// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

public class OpenAlexCitations {

	static final String DOI_FILTER_URL_UNFORMATTED = "https://api.openalex.org/works?filter=doi:%s";

	public Collection<MentionRecord> citations(String doi, String email) {

		String doiUrlEncoded = Utils.urlEncode(doi);
		String worksUri = DOI_FILTER_URL_UNFORMATTED.formatted(doiUrlEncoded);

		Optional<String> optionalCitationsUri = citationsUri(worksUri, email);
		if (optionalCitationsUri.isEmpty()) {
			return Collections.emptyList();
		}

		return scrapeCitations(optionalCitationsUri.get(), email);
	}

	static Optional<String> citationsUri(String worksUri, String email) {
		HttpResponse<String> response;
		if (email == null || email.isBlank()) {
			response = Utils.getAsHttpResponse(worksUri);
		} else {
			response = Utils.getAsHttpResponse(worksUri, "User-Agent", "mailto:" + email);
		}

		JsonObject tree = JsonParser.parseString(response.body()).getAsJsonObject();

		int count = tree
				.getAsJsonObject("meta")
				.getAsJsonPrimitive("count")
				.getAsInt();

		if (count == 0 || count > 1) {
			return Optional.empty();
		}

		String citationsUri = tree
				.getAsJsonArray("results")
				.get(0)
				.getAsJsonObject()
				.getAsJsonPrimitive("cited_by_api_url")
				.getAsString();

		return Optional.of(citationsUri);
	}

	// we use cursor paging as that will always work
	// https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/paging#cursor-paging
	static Collection<MentionRecord> scrapeCitations(String citationsUri, String email) {
		final int perPage = 200;
		String cursor = "*";

		Collection<MentionRecord> citations = new ArrayList<>();
		while (cursor != null) {
			HttpResponse<String> response;
			String citationsUriWithCursor = citationsUri + "&per-page=" + perPage + "&cursor=" + cursor;
			if (email == null || email.isBlank()) {
				response = Utils.getAsHttpResponse(citationsUriWithCursor);
			} else {
				response = Utils.getAsHttpResponse(citationsUriWithCursor, "User-Agent", "mailto:" + email);
			}
			JsonObject tree = JsonParser.parseString(response.body()).getAsJsonObject();

			cursor = Utils.stringOrNull(tree
					.getAsJsonObject("meta")
					.get("next_cursor")
			);

			JsonArray citationsArray = tree
					.getAsJsonArray("results");

			Instant now = Instant.now();
			for (JsonElement citation : citationsArray) {
				MentionRecord citationAsMention = parseCitationAsMention(citation, now);
				citations.add(citationAsMention);
			}
		}

		return citations;
	}

	static MentionRecord parseCitationAsMention(JsonElement element, Instant scrapedAt) {
		JsonObject citationObject = element.getAsJsonObject();

		MentionRecord mention = new MentionRecord();

		String doiUrl = Utils.stringOrNull(citationObject.get("doi"));
		String doi = doiUrl;
		if (doi != null) {
			doi = doi.replace("https://doi.org/", "");
		}
		mention.doi = doi;

		if (doiUrl != null) {
			mention.url = URI.create(doiUrl);
		}

		mention.title = Utils.stringOrNull(citationObject.get("title"));

		JsonArray authorsArray = citationObject.getAsJsonArray("authorships");
		Collection<String> authors = new ArrayList<>();
		for (JsonElement jsonElement : authorsArray) {
			authors.add(
					jsonElement
							.getAsJsonObject()
							.getAsJsonPrimitive("raw_author_name")
							.getAsString()
			);
		}
		mention.authors = String.join(", ", authors);

		mention.publisher = null;

		mention.publicationYear = Utils.integerOrNull(citationObject.get("publication_year"));

		mention.doiRegistrationDate = null;

		mention.journal = null;

		mention.page = null;

		mention.imageUrl = null;

		String crossrefType = Utils.stringOrNull(citationObject.get("type_crossref"));
		mention.mentionType = CrossrefMention.crossrefTypeMap.getOrDefault(crossrefType, MentionType.other);

		mention.externalId = citationObject
				.getAsJsonObject("ids")
				.getAsJsonPrimitive("openalex")
				.getAsString();

		mention.source = "OpenAlex";

		mention.scrapedAt = scrapedAt;

		mention.version = null;

		return mention;
	}
}
