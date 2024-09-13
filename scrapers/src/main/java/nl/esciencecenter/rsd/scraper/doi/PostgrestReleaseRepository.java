// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class PostgrestReleaseRepository {

	private final String backendUrl;

	public PostgrestReleaseRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	public Collection<ReleaseData> leastRecentlyScrapedReleases(int limit) {
		String data = Utils.getAsAdmin(backendUrl + "/rpc/software_join_release?concept_doi=not.is.null&order=releases_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseJson(data);
	}

	public void saveReleaseContent(Collection<ReleaseData> releaseData, Map<Doi, Collection<ExternalMentionRecord>> conceptDoiToDois, Map<Doi, UUID> versionDoiToMentionId) {
		// First update the releases_scraped_at column.
		JsonArray releasesBody = new JsonArray();
		Instant now = Instant.now();
		for (ReleaseData release : releaseData) {
			JsonObject data = new JsonObject();
			data.addProperty("software", release.softwareId.toString());
			data.addProperty("releases_scraped_at", now.toString());
			releasesBody.add(data);
		}
		Utils.postAsAdmin(Config.backendBaseUrl() + "/release", releasesBody.toString(), "Prefer", "resolution=merge-duplicates");


		// Then update the release_version table.
		// For each scraped or existing version as a mention, we need to know its id of the mention table and the ids (plural, because multiple software entries can have the same concept DOI) of the software to which it belongs.
		Map<Doi, Collection<UUID>> conceptDoiToSoftwareIds = new HashMap<>();
		for (ReleaseData release : releaseData) {
			Collection<UUID> softwareIds = conceptDoiToSoftwareIds.computeIfAbsent(release.conceptDoi, k -> new ArrayList<>());
			softwareIds.add(release.softwareId);
		}

		Map<Doi, Doi> versionDoiToConceptDoi = new HashMap<>();
		for (Map.Entry<Doi, Collection<ExternalMentionRecord>> conceptDoiToDoisEntry : conceptDoiToDois.entrySet()) {
			Doi conceptDoi = conceptDoiToDoisEntry.getKey();
			Collection<ExternalMentionRecord> versionDois = conceptDoiToDoisEntry.getValue();
			for (ExternalMentionRecord version : versionDois) {
				versionDoiToConceptDoi.put(version.doi(), conceptDoi);
			}
		}

		JsonArray coupling = new JsonArray();
		for (Map.Entry<Doi, Doi> entry : versionDoiToConceptDoi.entrySet()) {
			Doi versionDoi = entry.getKey();
			Doi conceptDoi = entry.getValue();
			Collection<UUID> softwareIds = conceptDoiToSoftwareIds.get(conceptDoi);
			for (UUID softwareId : softwareIds) {
				JsonObject couple = new JsonObject();
				UUID mentionId = versionDoiToMentionId.get(versionDoi);
				if (mentionId == null) {
					continue;
				}
				couple.addProperty("release_id", softwareId.toString());
				couple.addProperty("mention_id", mentionId.toString());
				coupling.add(couple);
			}
		}

		Utils.postAsAdmin(Config.backendBaseUrl() + "/release_version", coupling.toString(), "Prefer", "resolution=merge-duplicates");
	}

	Collection<ReleaseData> parseJson(String data) {
		JsonDeserializer<Doi> doiDeserializer = (json, type, context) -> Doi.fromString(json.getAsJsonPrimitive().getAsString());
		Gson gson = new GsonBuilder()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.registerTypeAdapter(Doi.class, doiDeserializer)
				.create();
		TypeToken<Collection<ReleaseData>> typeToken = new TypeToken<>() {
		};
		return gson.fromJson(data, typeToken.getType());
	}
}
