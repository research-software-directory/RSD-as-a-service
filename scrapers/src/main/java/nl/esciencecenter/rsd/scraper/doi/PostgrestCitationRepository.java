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
import java.util.TreeSet;
import java.util.HashSet;
import java.util.UUID;

public class PostgrestCitationRepository {

	private final String backendUrl;

	public PostgrestCitationRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	public Collection<CitationData> leastRecentlyScrapedCitations(int limit) {
		String oneHourAgoFilter = Utils.atLeastOneHourAgoFilter("citations_scraped_at");
		String uri = backendUrl + "/rpc/reference_papers_to_scrape?order=citations_scraped_at.asc.nullsfirst&limit=" + limit + "&" + oneHourAgoFilter;
		String data = Utils.getAsAdmin(uri);
		return parseJson(data);
	}

	public void saveCitations(String backendUrl, UUID idCitedMention, Collection<UUID> citingMentions, ZonedDateTime scrapedAt) {
		String jsonPatch = "{\"citations_scraped_at\": \"%s\"}".formatted(scrapedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		Utils.patchAsAdmin(backendUrl + "/mention?id=eq." + idCitedMention.toString(), jsonPatch);

		JsonArray jsonArray = new JsonArray();

                // We sometimes encouter duplicate citations which may lead to the operation to fail.
		HashSet<String> seen = new HashSet<>();

		for (UUID citingMention : citingMentions) {

			if (citingMention != null) {
 				String citationID = citingMention.toString();

				if (!seen.contains(citationID)) {
					seen.add(citationID);
	  				JsonObject jsonObject = new JsonObject();
					jsonObject.addProperty("mention", idCitedMention.toString());
					jsonObject.addProperty("citation", citationID);
					jsonArray.add(jsonObject);
				}
			}
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

			Collection<String> knownDois = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
			JsonArray doisArray = jsonObject.getAsJsonArray("known_dois");
			for (JsonElement element : doisArray) {
				knownDois.add(element.getAsString());
			}

			CitationData entry = new CitationData();
			entry.id = id;
			entry.doi = doi;
			entry.knownDois = knownDois;

			result.add(entry);
		}

		return result;
	}
}
