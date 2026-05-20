// SPDX-FileCopyrightText: 2023 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataCiteReleaseRepository {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataCiteReleaseRepository.class);

	// editorconfig-checker-disable
	private static final String QUERY_UNFORMATTED = """
		query {
		  works(ids: [%s], first: 10000) {
		    nodes {
		      doi
		      versions(first: 10000) {
		        totalCount
		        nodes {
		          doi
		        }
		      }
		    }
		  }
		}""";

	// editorconfig-checker-enable

	public Map<Doi, Collection<ExternalMentionRecord>> getVersionedDois(Collection<Doi> conceptDois) {
		if (conceptDois.isEmpty()) {
			return Collections.emptyMap();
		}

		String query = QUERY_UNFORMATTED.formatted(DataciteMentionRepository.joinDoisForGraphqlQuery(conceptDois));
		JsonObject body = new JsonObject();
		body.addProperty("query", query);
		String responseJson = Utils.post(
			"https://api.datacite.org/graphql",
			body.toString(),
			"Content-Type",
			"application/json"
		);
		return parseJson(responseJson);
	}

	Map<Doi, Collection<ExternalMentionRecord>> parseJson(String json) {
		DataciteMentionRepository dataciteMentionRepository = new DataciteMentionRepository();

		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray worksJson = root.getAsJsonObject("data").getAsJsonObject("works").getAsJsonArray("nodes");
		Map<Doi, Collection<ExternalMentionRecord>> releasesPerConceptDoi = new HashMap<>();
		for (JsonElement work : worksJson) {
			try {
				JsonObject workObject = work.getAsJsonObject();
				String conceptDoiString = workObject.getAsJsonPrimitive("doi").getAsString();
				Doi conceptDoi = Doi.fromString(conceptDoiString);

				Collection<Doi> versionDois = new ArrayList<>();
				JsonObject versionsObject = workObject.getAsJsonObject("versions");
				int versionCount = versionsObject.getAsJsonPrimitive("totalCount").getAsInt();
				if (versionCount > 10000) {
					LOGGER.warn(
						"There are {} versions for {}, while we can only harvest 10000",
						versionCount,
						conceptDoi
					);
				}

				JsonArray versionsDoiArray = versionsObject.getAsJsonArray("nodes");
				for (JsonElement versionElement : versionsDoiArray) {
					JsonObject relatedIdentifierObject = versionElement.getAsJsonObject();
					Doi versionDoi;
					try {
						versionDoi = Doi.fromString(relatedIdentifierObject.getAsJsonPrimitive("doi").getAsString());
					} catch (RuntimeException e) {
						LOGGER.warn("Could not read a version DOI for {}", conceptDoi, e);
						continue;
					}
					versionDois.add(versionDoi);
				}
				Collection<ExternalMentionRecord> versionedMentions = dataciteMentionRepository.mentionData(
					versionDois
				);

				releasesPerConceptDoi.put(conceptDoi, versionedMentions);
			} catch (RuntimeException e) {
				LOGGER.error("Failed to scrape a DataCite mention with data {}, ", work, e);
			}
		}
		return releasesPerConceptDoi;
	}
}
