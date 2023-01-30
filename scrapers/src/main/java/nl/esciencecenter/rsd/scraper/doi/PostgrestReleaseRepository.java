// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
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

	public void saveReleaseContent(Collection<ReleaseData> releaseData, Map<String, Collection<MentionRecord>> conceptDoiToDois, Map<String, UUID> versionDoiToMentionId) {
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
		// For each scraped or existing version as a mention, we need to know its id of the mention table and the id of the software to which it belongs.
		Map<String, UUID> conceptDoiToSoftwareId = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		for (ReleaseData release : releaseData) {
			conceptDoiToSoftwareId.put(release.conceptDoi, release.softwareId);
		}

		Map<String, String> versionDoiToConceptDoi = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		for (Map.Entry<String, Collection<MentionRecord>> conceptDoiToDoisEntry : conceptDoiToDois.entrySet()) {
			String conceptDoi = conceptDoiToDoisEntry.getKey();
			Collection<MentionRecord> versionDois = conceptDoiToDoisEntry.getValue();
			for (MentionRecord version : versionDois) {
				versionDoiToConceptDoi.put(version.doi, conceptDoi);
			}
		}

		JsonArray coupling = new JsonArray();
		for (String versionDoi : versionDoiToConceptDoi.keySet()) {
			JsonObject couple = new JsonObject();
			couple.addProperty("release_id", conceptDoiToSoftwareId.get(versionDoiToConceptDoi.get(versionDoi)).toString());
			couple.addProperty("mention_id", versionDoiToMentionId.get(versionDoi).toString());
			coupling.add(couple);
		}

		Utils.postAsAdmin(Config.backendBaseUrl() + "/release_version", coupling.toString(), "Prefer", "resolution=merge-duplicates");
	}

	Collection<ReleaseData> parseJson(String data) {
		Gson gson = new GsonBuilder()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.create();
		TypeToken<Collection<ReleaseData>> typeToken = new TypeToken<Collection<ReleaseData>>() {};
		return gson.fromJson(data, typeToken.getType());
	}
}
