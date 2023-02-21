// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class DataciteMentionRepository implements MentionRepository {

	private static final String QUERY_UNFORMATTED = """
			query {
			  works(ids: [%s]) {
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
			      publisher
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

	private static final Map<String, MentionType> dataciteTypeMap;
	private static final Map<String, MentionType> dataciteTextTypeMap;
	private static final Pattern URL_TREE_TAG_PATTERN = Pattern.compile("/tree/([^/]+)$");

	static {
//		https://schema.datacite.org/meta/kernel-4.4/
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
//		dataciteTypeMap.put("Text", MentionType.other);
		dataciteTypeMap.put("Workflow", MentionType.other);
		dataciteTypeMap.put("Other", MentionType.other);

		dataciteTextTypeMap = new HashMap<>();
		dataciteTextTypeMap.put("Conference paper", MentionType.conferencePaper);
		dataciteTextTypeMap.put("Dissertation", MentionType.thesis);
		dataciteTextTypeMap.put("Journal article", MentionType.journalArticle);
		dataciteTextTypeMap.put("Poster", MentionType.presentation);
		dataciteTextTypeMap.put("Presentation", MentionType.presentation);
		dataciteTextTypeMap.put("Report", MentionType.report);
	}

	//	"10.5281/zenodo.1408128","10.1186/s12859-018-2165-7"
	static String joinCollection(Collection<String> dois) {
		return dois.stream()
				.collect(Collectors.joining("\",\"", "\"", "\""));
	}

	static Collection<MentionRecord> jsonStringToUniqueMentions(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray worksJson = root.getAsJsonObject("data").getAsJsonObject("works").getAsJsonArray("nodes");
		Collection<MentionRecord> mentions = new ArrayList<>();
		Set<String> usedDois = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
		for (JsonElement work : worksJson) {
			try {
//				Sometimes, DataCite gives back two of the same results for one DOI, e.g. for 10.4122/1.1000000817,
//				so we need to only add it once, otherwise we cannot POST it to the backend
				MentionRecord parsedMention = parseWork(work.getAsJsonObject());
				if (usedDois.contains(parsedMention.doi)) continue;

				usedDois.add(parsedMention.doi);
				mentions.add(parsedMention);
			} catch (RuntimeException e) {
				System.out.println("Failed to scrape a DataCite mention with data " + work);
				e.printStackTrace();
			}
		}
		return mentions;
	}

	static MentionRecord parseWork(JsonObject work) {
		MentionRecord result = new MentionRecord();
		result.doi = work.get("doi").getAsString();
		result.url = URI.create("https://doi.org/" + Utils.urlEncode(result.doi));
		result.title = work.getAsJsonArray("titles").get(0).getAsJsonObject().get("title").getAsString();

		Collection<String> authors = new ArrayList<>();
		Iterable<JsonObject> creators = (Iterable) work.getAsJsonArray("creators");
		for (JsonObject creator : creators) {
			addAuthor(authors, creator);
		}
		Iterable<JsonObject> contributors = (Iterable) work.getAsJsonArray("contributors");
		for (JsonObject contributor : contributors) {
			addAuthor(authors, contributor);
		}
		result.authors = String.join(", ", authors);

		result.publisher = Utils.stringOrNull(work.get("publisher"));
		result.publicationYear = Utils.integerOrNull(work.get("publicationYear"));
		String doiRegistrationDateString = Utils.stringOrNull(work.get("registered"));
		if (doiRegistrationDateString != null) {
			result.doiRegistrationDate = ZonedDateTime.parse(doiRegistrationDateString);
		}

		String dataciteResourceTypeGeneral = Utils.stringOrNull(work.getAsJsonObject("types").get("resourceTypeGeneral"));
		if (dataciteResourceTypeGeneral != null && dataciteResourceTypeGeneral.equals("Text")) {
			String dataciteResourceType = Utils.stringOrNull(work.getAsJsonObject("types").get("resourceType"));
			if (dataciteResourceType != null) dataciteResourceType = dataciteResourceType.strip();
			result.mentionType = dataciteTextTypeMap.getOrDefault(dataciteResourceType, MentionType.other);
		} else {
			result.mentionType = dataciteTypeMap.getOrDefault(dataciteResourceTypeGeneral, MentionType.other);
		}
		result.source = "DataCite";
		result.version = Utils.stringOrNull(work.get("version"));
		// if the version is null, we can often get the version from a linked Git URL which ends in "/tree/{tag}"
		if (result.version == null) {
			JsonArray relatedIdentifiers = work.getAsJsonArray("relatedIdentifiers");
			for (JsonElement relatedIdentifier : relatedIdentifiers) {
				String relatedIdentifierString = Utils.stringOrNull(relatedIdentifier.getAsJsonObject().get("relatedIdentifier"));
				String relatedIdentifierType = Utils.stringOrNull(relatedIdentifier.getAsJsonObject().get("relatedIdentifierType"));
				if (relatedIdentifierString != null && relatedIdentifierType != null && relatedIdentifierType.equals("URL")) {
					Matcher tagMatcher = URL_TREE_TAG_PATTERN.matcher(relatedIdentifierString);
					if (tagMatcher.find()) {
						result.version = tagMatcher.group(1);
						break;
					}
				}
			}
		}

		result.scrapedAt = Instant.now();
		return result;
	}

	static void addAuthor(Collection<String> authors, JsonObject author) {
		String givenName = Utils.stringOrNull(author.get("givenName"));
		String familyName = Utils.stringOrNull(author.get("familyName"));
		if (givenName == null && familyName == null) return;
		if (givenName == null) authors.add(familyName);
		else if (familyName == null) authors.add(givenName);
		else authors.add(givenName + " " + familyName);
	}

	@Override
	public Collection<MentionRecord> leastRecentlyScrapedMentions(int limit) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Collection<MentionRecord> mentionData(Collection<String> dois) {
		if (dois.isEmpty()) return Collections.EMPTY_LIST;

		JsonObject body = new JsonObject();
		body.addProperty("query", QUERY_UNFORMATTED.formatted(joinCollection(dois)));
		String responseJson = Utils.post("https://api.datacite.org/graphql", body.toString(), "Content-Type", "application/json");
		return jsonStringToUniqueMentions(responseJson);
	}

	@Override
	public Map<String, UUID> save(Collection<MentionRecord> mentions) {
		throw new UnsupportedOperationException();
	}

}
