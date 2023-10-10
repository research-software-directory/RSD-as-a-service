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

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.UUID;

public class PostgrestCitationRepository {

	private final String backendUrl;

	public PostgrestCitationRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	public Collection<CitationData> leastRecentlyScrapedCitations(int limit) {
		String oneHourAgoFilter = Utils.atLeastOneHourAgoFilter("citations_scraped_at");
		// String uri = backendUrl + "/rpc/mentions_to_scrape?order=citations_scraped_at.asc.nullsfirst&limit=" + limit + "&" + oneHourAgoFilter;
		String uri = backendUrl + "/rpc/mentions_to_scrape?order=citations_scraped_at.asc.nullsfirst&limit=" + limit;
		String data = Utils.getAsAdmin(uri);
		return parseJson(data);
	}

	public void saveCitations(String backendUrl, UUID idCitedMention, Collection<UUID> citingMentions, ZonedDateTime scrapedAt) {
		System.out.println(citingMentions.size());
		String jsonPatch = "{\"citations_scraped_at\": \"%s\"}".formatted(scrapedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		Utils.patchAsAdmin(backendUrl + "/mention", jsonPatch);

		JsonArray jsonArray = new JsonArray();

		for (UUID citingMention : citingMentions) {
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("mention", idCitedMention.toString());
			jsonObject.addProperty("citation", citingMention.toString());
			jsonArray.add(jsonObject);
		}

		String uri = backendUrl + "/citation_for_mention";

		Utils.postAsAdmin(uri, jsonArray.toString(), "Prefer", "resolution=merge-duplicates");
	}

	static Collection<CitationData> parseJson(String data) {
		JsonArray array = JsonParser.parseString(data).getAsJsonArray();
		Collection<CitationData> result = new ArrayList<>();

		for (JsonElement jsonElement : array) {
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			UUID id = UUID.fromString(jsonObject.getAsJsonPrimitive("id").getAsString());
			String doi = jsonObject.getAsJsonPrimitive("doi").getAsString();

			CitationData entry = new CitationData();
			entry.id = id;
			entry.doi = doi;

			result.add(entry);
		}

		return result;
	}
}
