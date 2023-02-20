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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;

public class DataCiteReleaseRepository {

	private static final String QUERY_UNFORMATTED = """
			query {
			  works(ids: [%s]) {
			    nodes {
			      doi
			      versionOfCount
			      versions(first: 10000) {
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
			    }
			  }
			}
			""";

	public Map<String, Collection<MentionRecord>> getVersionedDois(Collection<String> conceptDois) {
		if (conceptDois.isEmpty()) return Collections.EMPTY_MAP;

		String query = QUERY_UNFORMATTED.formatted(DataciteMentionRepository.joinCollection(conceptDois));
		JsonObject body = new JsonObject();
		body.addProperty("query", query);
		String responseJson = Utils.post("https://api.datacite.org/graphql", body.toString(), "Content-Type", "application/json");
		return parseJson(responseJson);
	}

	Map<String, Collection<MentionRecord>> parseJson(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray worksJson = root.getAsJsonObject("data").getAsJsonObject("works").getAsJsonArray("nodes");
		Map<String, Collection<MentionRecord>> releasesPerConceptDoi = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		for (JsonElement work : worksJson) {
			try {
				JsonObject workObject = work.getAsJsonObject();
				String conceptDoi = workObject.getAsJsonPrimitive("doi").getAsString();
				Integer verionOfCount = Utils.integerOrNull(workObject.get("versionOfCount"));
				if (verionOfCount == null || verionOfCount.intValue() != 0) {
					System.out.println("%s is not a concept DOI".formatted(conceptDoi));
					continue;
				}

				Collection<MentionRecord> versionedMentions = new ArrayList<>();
				JsonArray versionedMentionsJson = workObject.getAsJsonObject("versions").getAsJsonArray("nodes");
				versionedMentionsJson.forEach(versionedMentionJson -> {
					MentionRecord versionedMention = DataciteMentionRepository.parseWork(versionedMentionJson.getAsJsonObject());
					versionedMentions.add(versionedMention);
				});

				releasesPerConceptDoi.put(conceptDoi, versionedMentions);
			} catch (RuntimeException e) {
				System.out.println("Failed to scrape a DataCite mention with data " + work);
				e.printStackTrace();
			}
		}
		return releasesPerConceptDoi;
	}
}
