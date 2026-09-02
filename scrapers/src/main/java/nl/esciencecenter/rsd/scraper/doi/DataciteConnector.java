// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
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
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Throttler;
import nl.esciencecenter.rsd.scraper.Utils;

public class DataciteConnector {

	private final String contactEmail;
	private final Throttler requestThrottler;

	private static final String DOI_URL_UNFORMATTED = "https://api.datacite.org/dois/%s";

	/**
	 * Constructs a connector that sends "Unidentified" requests to the DataCite REST API.
	 * <br>
	 * <br>
	 * See the <a href="https://support.datacite.org/docs/rate-limit">DataCite API Rate Limits page</a> for more
	 * information on rate limiting and authentication.
	 */
	public DataciteConnector() {
		contactEmail = null;
		requestThrottler = new Throttler(475, 5, TimeUnit.MINUTES);
	}

	/**
	 * Constructs a connector that sends "Identified" requests to the DataCite REST API, using the supplied email address.
	 * <br>
	 * <br>
	 * See the <a href="https://support.datacite.org/docs/rate-limit">DataCite API Rate Limits page</a> for more
	 * information on rate limiting and authentication.
	 *
	 * @param contactEmail the email address to use when sending requests to the DataCite REST API
	 */
	public DataciteConnector(String contactEmail) {
		this.contactEmail = Objects.requireNonNull(contactEmail);
		requestThrottler = new Throttler(950, 5, TimeUnit.MINUTES);
	}

	/**
	 * Harvest a mention from its DOI from DataCite.
	 * <br>
	 * <br>
	 * An example of a concept DOI with versions is <code>10.5281/zenodo.6379973</code>.
	 * Its API data can be found in
	 * <a href="https://api.datacite.org/dois/10.5281/zenodo.6379973">
	 * this REST endpoint.
	 * </a>
	 *
	 * @param doi The DOI that should be harvested. This DOI should be registered at DataCite.
	 * @return the harvested mention
	 */
	public ExternalMentionRecord harvestMention(Doi doi)
		throws InterruptedException, IOException, RsdResponseException {
		Objects.requireNonNull(doi);

		URI url = URI.create(DOI_URL_UNFORMATTED.formatted(doi.toUrlEncodedString()));

		this.requestThrottler.awaitPermission();
		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		if (response.statusCode() != 200) {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				response.body(),
				"Could not harvest DataCite mention with DOI %s".formatted(doi)
			);
		}

		return DataciteParser.parseMention(response.body());
	}

	/**
	 * Harvest the version DOIs of a (concept) DOI. See e.g.
	 * <a href="https://support.zenodo.org/help/en-gb/1-upload-deposit/97-what-is-doi-versioning">
	 * this Zenodo explanation.
	 * </a>
	 * <br>
	 * <br>
	 * An example of a concept DOI with versions is <code>10.5281/zenodo.6379973</code>.
	 * Its versions can be found in
	 * <a href="https://api.datacite.org/dois/10.5281/zenodo.6379973">
	 * this REST endpoint
	 * </a>
	 * under the <code>versions</code> key.
	 * <br>
	 * <br>
	 * This example also shows that a concept DOI can be its own version. This method removes the concept DOI from the returned version DOIs.
	 *
	 * @param conceptDoi The (concept) DOI that should have their versions harvested. This DOI should be registered at DataCite. See the link above for an explanation of concept DOIs.
	 *                    This DOI should not be null.
	 * @return the DOIs that are versions of the queried DOI
	 */
	public Collection<Doi> harvestVersionedDois(Doi conceptDoi)
		throws InterruptedException, IOException, RsdResponseException {
		Objects.requireNonNull(conceptDoi);

		URI url = URI.create(DOI_URL_UNFORMATTED.formatted(conceptDoi.toUrlEncodedString()));

		this.requestThrottler.awaitPermission();
		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		if (response.statusCode() != 200) {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				response.body(),
				"Could not harvest version DOIs of %s".formatted(conceptDoi)
			);
		}

		Collection<Doi> result = DataciteParser.parseVersionDois(response.body());
		result.removeIf(versionDoi -> versionDoi.equals(conceptDoi));
		return result;
	}

	static class DataciteParser {

		private static final Map<String, MentionType> dataciteTypeMap;
		private static final Map<String, MentionType> dataciteTextTypeMap;
		private static final Pattern URL_TREE_TAG_PATTERN = Pattern.compile("/tree/([^/]+)$");

		static {
			// https://schema.datacite.org/meta/kernel-4.7/
			dataciteTypeMap = new HashMap<>();
			dataciteTypeMap.put("Audiovisual", MentionType.presentation);
			dataciteTypeMap.put("Award", MentionType.other);
			dataciteTypeMap.put("Book", MentionType.book);
			dataciteTypeMap.put("BookChapter", MentionType.bookSection);
			dataciteTypeMap.put("Collection", MentionType.other);
			dataciteTypeMap.put("ComputationalNotebook", MentionType.computerProgram);
			dataciteTypeMap.put("ConferencePaper", MentionType.conferencePaper);
			dataciteTypeMap.put("ConferenceProceeding", MentionType.conferencePaper);
			dataciteTypeMap.put("DataPaper", MentionType.other);
			dataciteTypeMap.put("Dataset", MentionType.dataset);
			dataciteTypeMap.put("Dissertation", MentionType.thesis);
			dataciteTypeMap.put("Event", MentionType.workshop);
			dataciteTypeMap.put("Image", MentionType.other);
			dataciteTypeMap.put("Instrument", MentionType.other);
			dataciteTypeMap.put("InteractiveResource", MentionType.other);
			dataciteTypeMap.put("Journal", MentionType.journalArticle);
			dataciteTypeMap.put("JournalArticle", MentionType.journalArticle);
			dataciteTypeMap.put("Model", MentionType.other);
			dataciteTypeMap.put("OutputManagementPlan", MentionType.other);
			dataciteTypeMap.put("PeerReview", MentionType.other);
			dataciteTypeMap.put("Poster", MentionType.poster);
			dataciteTypeMap.put("Preprint", MentionType.other);
			dataciteTypeMap.put("Presentation", MentionType.presentation);
			dataciteTypeMap.put("Project", MentionType.other);
			dataciteTypeMap.put("PhysicalObject", MentionType.other);
			dataciteTypeMap.put("Report", MentionType.report);
			dataciteTypeMap.put("Service", MentionType.other);
			dataciteTypeMap.put("Software", MentionType.computerProgram);
			dataciteTypeMap.put("Sound", MentionType.other);
			dataciteTypeMap.put("Standard", MentionType.other);
			dataciteTypeMap.put("StudyRegistration", MentionType.thesis);
			// dataciteTypeMap.put("Text", MentionType.other);
			dataciteTypeMap.put("Workflow", MentionType.other);
			dataciteTypeMap.put("Other", MentionType.other);

			dataciteTextTypeMap = new HashMap<>();
			dataciteTextTypeMap.put("Conference paper", MentionType.conferencePaper);
			dataciteTextTypeMap.put("Dissertation", MentionType.thesis);
			dataciteTextTypeMap.put("Journal article", MentionType.journalArticle);
			dataciteTextTypeMap.put("Poster", MentionType.poster);
			dataciteTextTypeMap.put("Presentation", MentionType.presentation);
			dataciteTextTypeMap.put("Report", MentionType.report);
		}

		private DataciteParser() {}

		static ExternalMentionRecord parseMention(String json) {
			JsonObject root = JsonParser.parseString(json).getAsJsonObject();
			JsonObject data = root.getAsJsonObject("data");
			JsonObject attributes = data.getAsJsonObject("attributes");

			Doi doi = Doi.fromString(attributes.getAsJsonPrimitive("doi").getAsString());

			String rawDoiRegistrationDate = Utils.stringOrNull(attributes.get("registered"));
			ZonedDateTime doiRegistrationDate =
				rawDoiRegistrationDate == null ? null : ZonedDateTime.parse(rawDoiRegistrationDate);
			URI url = URI.create("https://doi.org/" + Utils.urlEncode(doi.toString()));
			String title = attributes
				.getAsJsonArray("titles")
				.get(0)
				.getAsJsonObject()
				.getAsJsonPrimitive("title")
				.getAsString();

			Collection<String> authorsBuilder = new ArrayList<>();
			for (JsonElement creator : attributes.getAsJsonArray("creators")) {
				addAuthor(authorsBuilder, creator.getAsJsonObject());
			}
			for (JsonElement contributor : attributes.getAsJsonArray("contributors")) {
				addAuthor(authorsBuilder, contributor.getAsJsonObject());
			}
			String authors = String.join(", ", authorsBuilder);

			String publisher = Utils.stringOrNull(attributes.get("publisher"));
			Integer publicationYear = Utils.integerOrNull(attributes.get("publicationYear"));

			MentionType mentionType;
			String dataciteResourceTypeGeneral = Utils.stringOrNull(
				attributes.getAsJsonObject("types").get("resourceTypeGeneral")
			);
			if (dataciteResourceTypeGeneral != null && dataciteResourceTypeGeneral.equals("Text")) {
				String dataciteResourceType = Utils.stringOrNull(
					attributes.getAsJsonObject("types").get("resourceType")
				);
				if (dataciteResourceType != null) {
					dataciteResourceType = dataciteResourceType.strip();
				}
				mentionType = dataciteTextTypeMap.getOrDefault(dataciteResourceType, MentionType.other);
			} else {
				mentionType = dataciteTypeMap.getOrDefault(dataciteResourceTypeGeneral, MentionType.other);
			}

			String version = Utils.stringOrNull(attributes.get("version"));
			// if the version is null, we can often get the version from a linked Git URL which ends in "/tree/{tag}"
			if (version == null) {
				JsonArray relatedIdentifiers = attributes.getAsJsonArray("relatedIdentifiers");
				for (JsonElement relatedIdentifier : relatedIdentifiers) {
					String relatedIdentifierString = Utils.stringOrNull(
						relatedIdentifier.getAsJsonObject().get("relatedIdentifier")
					);
					String relatedIdentifierType = Utils.stringOrNull(
						relatedIdentifier.getAsJsonObject().get("relatedIdentifierType")
					);
					if (
						relatedIdentifierString != null &&
						relatedIdentifierType != null &&
						relatedIdentifierType.equals("URL")
					) {
						Matcher tagMatcher = URL_TREE_TAG_PATTERN.matcher(relatedIdentifierString);
						if (tagMatcher.find()) {
							version = tagMatcher.group(1);
							break;
						}
					}
				}
			}

			return new ExternalMentionRecord(
				doi,
				doiRegistrationDate,
				null,
				url,
				title,
				authors,
				publisher,
				publicationYear,
				null,
				null,
				mentionType,
				"DataCite",
				version
			);
		}

		static void addAuthor(Collection<String> authors, JsonObject author) {
			String givenName = Utils.stringOrNull(author.get("givenName"));
			String familyName = Utils.stringOrNull(author.get("familyName"));
			if (givenName == null && familyName == null) {
				return;
			}

			if (givenName == null) {
				authors.add(familyName);
			} else if (familyName == null) {
				authors.add(givenName);
			} else {
				authors.add(givenName + " " + familyName);
			}
		}

		static Collection<Doi> parseVersionDois(String json) {
			JsonObject root = JsonParser.parseString(json).getAsJsonObject();
			JsonArray doiJsonArray = root
				.getAsJsonObject("data")
				.getAsJsonObject("relationships")
				.getAsJsonObject("versions")
				.getAsJsonArray("data");

			Collection<Doi> result = new ArrayList<>(doiJsonArray.size());
			for (JsonElement element : doiJsonArray) {
				JsonObject dataObject = element.getAsJsonObject();
				if (!"dois".equals(dataObject.getAsJsonPrimitive("type").getAsString())) {
					continue;
				}

				String rawDoi = dataObject.getAsJsonPrimitive("id").getAsString();
				if (Doi.isValid(rawDoi)) {
					result.add(Doi.fromString(rawDoi));
				}
			}

			return result;
		}
	}
}
