// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Objects;
import java.util.UUID;

public class PostgrestMentionRepository implements MentionRepository {

	private final String backendUrl;

	public PostgrestMentionRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	static Collection<MentionRecord> parseJson(String data) {
		return new GsonBuilder()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.registerTypeAdapter(Instant.class, (JsonDeserializer<Instant>) (json, typeOfT, context) -> Instant.parse(json.getAsString()))
				.registerTypeAdapter(ZonedDateTime.class, (JsonDeserializer<ZonedDateTime>) (json, typeOfT, context) -> ZonedDateTime.parse(json.getAsString()))
				.registerTypeAdapter(URI.class, (JsonDeserializer<URI>) (json, typeOfT, context) -> {
					try {
						return URI.create(json.getAsString());
					} catch (IllegalArgumentException e) {
						System.out.println("Warning: couldn't create a URI of the following: " + json.getAsString());
						return null;
					}
				})
				.create()
				.fromJson(data, new TypeToken<Collection<MentionRecord>>() {
				}.getType());
	}

	@Override
	public Collection<MentionRecord> leastRecentlyScrapedMentions(int limit) {
		String data = Utils.getAsAdmin(backendUrl + "/mention?doi=not.is.null&order=scraped_at.asc.nullsfirst&limit=" + limit);
		return parseJson(data);
	}

	@Override
	public Collection<MentionRecord> mentionData(Collection<String> dois) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void save(Collection<MentionRecord> mentions) {
		Gson gson = new GsonBuilder()
				.serializeNulls()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.registerTypeAdapter(Instant.class, (JsonSerializer<Instant>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
				.registerTypeAdapter(ZonedDateTime.class, (JsonSerializer<ZonedDateTime>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
				.create();
		for (MentionRecord mention : mentions) {
			String scrapedMentionJson = gson.toJson(mention);
			String onConflictFilter;
			if (mention.doi != null) {
				onConflictFilter = "doi";
			} else {
				onConflictFilter = "external_id,source";
			}

			String uri = "%s/mention?on_conflict=%s&select=id".formatted(backendUrl, onConflictFilter);
			String response = Utils.postAsAdmin(uri, scrapedMentionJson, "Prefer", "resolution=merge-duplicates,return=representation");

			JsonArray responseAsArray = JsonParser.parseString(response).getAsJsonArray();
			UUID id = UUID.fromString(responseAsArray.get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString());
			mention.id = id;
		}
	}
}
