// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class DataciteMentionRepository {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataciteMentionRepository.class);

	// editorconfig-checker-disable
	private static final String QUERY_UNFORMATTED = """
		query {
		  works(ids: [%s], first: 10000) {
		    nodes {
		      doi
		      types {
		        resourceType
		        resourceTypeGeneral
		      }
		      version
		      relatedIdentifiers {
		        relatedIdentifier
		        relatedIdentifierType
		      }
		      titles(first: 1) {
		        title
		      }
		      publisher {
		        name
		      }
		      publicationYear
		      registered
		      creators {
		        givenName
		        familyName
		      }
		      contributors {
		        givenName
		        familyName
		      }
		    }
		  }
		}""";
	// editorconfig-checker-enable

	private static final Map<String, MentionType> dataciteTypeMap;
	private static final Map<String, MentionType> dataciteTextTypeMap;
	private static final Pattern URL_TREE_TAG_PATTERN = Pattern.compile("/tree/([^/]+)$");

	static {
		// https://schema.datacite.org/meta/kernel-4.4/
		dataciteTypeMap = new HashMap<>();
		dataciteTypeMap.put("Audiovisual", MentionType.presentation);
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
		dataciteTypeMap.put("InteractiveResource", MentionType.other);
		dataciteTypeMap.put("Journal", MentionType.journalArticle);
		dataciteTypeMap.put("JournalArticle", MentionType.journalArticle);
		dataciteTypeMap.put("Model", MentionType.other);
		dataciteTypeMap.put("OutputManagementPlan", MentionType.other);
		dataciteTypeMap.put("PeerReview", MentionType.other);
		dataciteTypeMap.put("Preprint", MentionType.other);
		dataciteTypeMap.put("PhysicalObject", MentionType.other);
		dataciteTypeMap.put("Report", MentionType.report);
		dataciteTypeMap.put("Service", MentionType.other);
		dataciteTypeMap.put("Software", MentionType.computerProgram);
		dataciteTypeMap.put("Sound", MentionType.other);
		dataciteTypeMap.put("Standard", MentionType.other);
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

	// "10.5281/zenodo.1408128","10.1186/s12859-018-2165-7"
	static String joinDoisForGraphqlQuery(Collection<Doi> dois) {
		return dois.stream()
			.map(Doi::toString)
			.collect(Collectors.joining("\",\"", "\"", "\""));
	}

	static Collection<ExternalMentionRecord> jsonStringToUniqueMentions(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray worksJson = root.getAsJsonObject("data").getAsJsonObject("works").getAsJsonArray("nodes");
		Collection<ExternalMentionRecord> mentions = new ArrayList<>();
		Set<Doi> usedDois = new HashSet<>();
		for (JsonElement work : worksJson) {
			try {
				// Sometimes, DataCite gives back two of the same results for one DOI, e.g. for 10.4122/1.1000000817,
				// so we need to only add it once, otherwise we cannot POST it to the backend
				ExternalMentionRecord parsedMention = parseWork(work.getAsJsonObject());
				if (usedDois.contains(parsedMention.doi())) continue;

				usedDois.add(parsedMention.doi());
				mentions.add(parsedMention);
			} catch (RuntimeException e) {
				// TODO: fix exception type
				LOGGER.error("Failed to scrape a DataCite mention with data {} ", work, e);
			}
		}
		return mentions;
	}

	static ExternalMentionRecord parseWork(JsonObject work) {
		Doi doi = Doi.fromString(work.get("doi").getAsString());
		URI url = URI.create("https://doi.org/" + Utils.urlEncode(doi.toString()));
		String title = work.getAsJsonArray("titles").get(0).getAsJsonObject().get("title").getAsString();

		Collection<String> authorsBuilder = new ArrayList<>();
		Iterable<JsonObject> creators = (Iterable) work.getAsJsonArray("creators");
		for (JsonObject creator : creators) {
			addAuthor(authorsBuilder, creator);
		}
		Iterable<JsonObject> contributors = (Iterable) work.getAsJsonArray("contributors");
		for (JsonObject contributor : contributors) {
			addAuthor(authorsBuilder, contributor);
		}
		String authors = String.join(", ", authorsBuilder);

		String publisher = Utils.stringOrNull(work.getAsJsonObject("publisher").get("name"));
		Integer publicationYear = Utils.integerOrNull(work.get("publicationYear"));
		String doiRegistrationDateString = Utils.stringOrNull(work.get("registered"));
		ZonedDateTime doiRegistrationDate = null;
		if (doiRegistrationDateString != null) {
			doiRegistrationDate = ZonedDateTime.parse(doiRegistrationDateString);
		}

		MentionType mentionType;
		String dataciteResourceTypeGeneral = Utils.stringOrNull(work.getAsJsonObject("types").get("resourceTypeGeneral"));
		if (dataciteResourceTypeGeneral != null && dataciteResourceTypeGeneral.equals("Text")) {
			String dataciteResourceType = Utils.stringOrNull(work.getAsJsonObject("types").get("resourceType"));
			if (dataciteResourceType != null) dataciteResourceType = dataciteResourceType.strip();
			mentionType = dataciteTextTypeMap.getOrDefault(dataciteResourceType, MentionType.other);
		} else {
			mentionType = dataciteTypeMap.getOrDefault(dataciteResourceTypeGeneral, MentionType.other);
		}
		String version = Utils.stringOrNull(work.get("version"));
		// if the version is null, we can often get the version from a linked Git URL which ends in "/tree/{tag}"
		if (version == null) {
			JsonArray relatedIdentifiers = work.getAsJsonArray("relatedIdentifiers");
			for (JsonElement relatedIdentifier : relatedIdentifiers) {
				String relatedIdentifierString = Utils.stringOrNull(relatedIdentifier.getAsJsonObject().get("relatedIdentifier"));
				String relatedIdentifierType = Utils.stringOrNull(relatedIdentifier.getAsJsonObject().get("relatedIdentifierType"));
				if (relatedIdentifierString != null && relatedIdentifierType != null && relatedIdentifierType.equals("URL")) {
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
		if (givenName == null && familyName == null) return;
		if (givenName == null) authors.add(familyName);
		else if (familyName == null) authors.add(givenName);
		else authors.add(givenName + " " + familyName);
	}

	public Collection<ExternalMentionRecord> mentionData(Collection<Doi> dois) {
		if (dois == null || dois.isEmpty()) {
			return Collections.emptyList();
		}

		JsonObject body = new JsonObject();
		body.addProperty("query", QUERY_UNFORMATTED.formatted(joinDoisForGraphqlQuery(dois)));
		String responseJson = Utils.post("https://api.datacite.org/graphql", body.toString(), "Content-Type", "application/json");
		return jsonStringToUniqueMentions(responseJson);
	}
}
