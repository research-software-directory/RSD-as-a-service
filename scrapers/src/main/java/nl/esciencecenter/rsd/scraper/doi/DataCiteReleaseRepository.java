// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class DataCiteReleaseRepository {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataCiteReleaseRepository.class);

	// editorconfig-checker-disable
	private static final String QUERY_UNFORMATTED = """
		query {
		  works(ids: [%s], first: 10000) {
		    nodes {
		      doi
		      versionOfCount
		      relatedIdentifiers {
		        relationType
		        relatedIdentifierType
		        relatedIdentifier
		      }
		    }
		  }
		}
		""";
	// editorconfig-checker-enable

	public Map<Doi, Collection<ExternalMentionRecord>> getVersionedDois(Collection<Doi> conceptDois) {
		if (conceptDois.isEmpty()) {
			return Collections.emptyMap();
		}

		String query = QUERY_UNFORMATTED.formatted(DataciteMentionRepository.joinDoisForGraphqlQuery(conceptDois));
		JsonObject body = new JsonObject();
		body.addProperty("query", query);
		String responseJson = Utils.post("https://api.datacite.org/graphql", body.toString(), "Content-Type", "application/json");
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
				Integer versionOfCount = Utils.integerOrNull(workObject.get("versionOfCount"));
				if (versionOfCount == null || versionOfCount.intValue() != 0) {
					LOGGER.debug("{} is not a concept DOI", conceptDoiString);
					continue;
				}

				Collection<Doi> versionDois = new ArrayList<>();
				JsonArray relatedIdentifiers = workObject.getAsJsonArray("relatedIdentifiers");
				for (JsonElement relatedIdentifier : relatedIdentifiers) {
					JsonObject relatedIdentifierObject = relatedIdentifier.getAsJsonObject();
					String relationType = relatedIdentifierObject.getAsJsonPrimitive("relationType").getAsString();
					if (relationType == null || !relationType.equals("HasVersion")) continue;

					String relatedIdentifierType = relatedIdentifierObject.getAsJsonPrimitive("relatedIdentifierType").getAsString();
					if (relatedIdentifierType == null || !relatedIdentifierType.equals("DOI")) continue;

					String relatedIdentifierDoi = relatedIdentifierObject.getAsJsonPrimitive("relatedIdentifier").getAsString();
					versionDois.add(Doi.fromString(relatedIdentifierDoi));
				}
				Collection<ExternalMentionRecord> versionedMentions = dataciteMentionRepository.mentionData(versionDois);

				releasesPerConceptDoi.put(conceptDoi, versionedMentions);
			} catch (RuntimeException e) {
				LOGGER.error("Failed to scrape a DataCite mention with data {}, ", work, e);
			}
		}
		return releasesPerConceptDoi;
	}
}
