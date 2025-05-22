// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.UUID;

public class PostgrestMentionRepository {

	private static final Gson GSON = new GsonBuilder()
			.serializeNulls()
			.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
			.registerTypeAdapter(Instant.class, (JsonSerializer<Instant>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
			.registerTypeAdapter(ZonedDateTime.class, (JsonSerializer<ZonedDateTime>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
			.registerTypeAdapter(Doi.class, (JsonSerializer<Doi>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
			.create();

	private final String backendUrl;


	public PostgrestMentionRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	static Collection<RsdMentionIds> parseMultipleRsdIds(String json) {
		Collection<RsdMentionIds> result = new ArrayList<>();

		JsonArray rootArray = JsonParser.parseString(json).getAsJsonArray();
		for (JsonElement jsonElement : rootArray) {

			JsonObject arrayEntry = jsonElement.getAsJsonObject();
			UUID id = UUID.fromString(arrayEntry.getAsJsonPrimitive("id").getAsString());
			String doiString = Utils.stringOrNull(arrayEntry.get("doi"));
			Doi doi = doiString == null ? null : Doi.fromString(doiString);
			String openalexIdString = Utils.stringOrNull(arrayEntry.get("openalex_id"));
			OpenalexId openalexId = openalexIdString == null ? null : OpenalexId.fromString(openalexIdString);

			result.add(new RsdMentionIds(id, doi, openalexId));
		}

		return result;
	}

	public static JsonArray toRsdJsonArray(Collection<ExternalMentionRecord> mentions) {
		return GSON.toJsonTree(mentions).getAsJsonArray();
	}

	static RsdMentionIds parseSingleRsdIds(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonArray().get(0).getAsJsonObject();

		UUID id = UUID.fromString(root.getAsJsonPrimitive("id").getAsString());
		String doiString = Utils.stringOrNull(root.get("doi"));
		Doi doi = doiString == null ? null : Doi.fromString(doiString);
		String openalexIdString = Utils.stringOrNull(root.get("openalex_id"));
		OpenalexId openalexId = openalexIdString == null ? null : OpenalexId.fromString(openalexIdString);

		return new RsdMentionIds(id, doi, openalexId);
	}

	public Collection<RsdMentionIds> leastRecentlyScrapedMentions(int limit) {
		String data = Utils.getAsAdmin(backendUrl + "/mention?or=(doi.not.is.null,openalex_id.not.is.null)&order=scraped_at.asc.nullsfirst&select=id,doi,openalex_id&limit=" + limit);
		return parseMultipleRsdIds(data);
	}

	public void saveScrapedAt(RsdMentionIds ids, Instant scrapedAt) {
		JsonObject root = new JsonObject();
		root.addProperty("scraped_at", scrapedAt.toString());
		Utils.patchAsAdmin(backendUrl + "/mention?select=id,doi,openalex_id&id=eq." + ids.id(), root.toString(), "Prefer", "return=representation");
	}

	public RsdMentionIds updateMention(RsdMentionRecord mention, boolean updateOpenAlexId) {
		JsonObject root = createJsonFromMentionData(mention.content(), updateOpenAlexId);
		root.addProperty("scraped_at", mention.scrapedAt().toString());
		String response = Utils.patchAsAdmin(backendUrl + "/mention?select=id,doi,openalex_id&id=eq." + mention.id(), root.toString(), "Prefer", "return=representation");
		return parseSingleRsdIds(response);
	}

	public RsdMentionIds createMentionIfNotExistsOnDoiAndGetIds(ExternalMentionRecord mention, Instant scrapedAt) {
		Doi doi = mention.doi();
		Objects.requireNonNull(doi);
		Collection<RsdMentionIds> mentionsWithDoi = parseMultipleRsdIds(Utils.getAsAdmin(backendUrl + "/mention?select=id,doi,openalex_id&doi=eq." + doi.toUrlEncodedString()));
		if (mentionsWithDoi.size() == 1) {
			return mentionsWithDoi.iterator().next();
		}

		return createNewMention(mention, scrapedAt, false);
	}

	public RsdMentionIds createOrUpdateMentionWithOpenalexId(ExternalMentionRecord mention, Instant scrapedAt) {
		OpenalexId openalexId = Objects.requireNonNull(mention.openalexId());
		Doi doi = mention.doi();

		String query = "/mention?select=id,doi,openalex_id";
		if (mention.doi() != null) {
			query += "&or=(openalex_id.eq.%s,doi.eq.%s)".formatted(openalexId.toUrlEncodedString(), doi.toUrlEncodedString());
		} else {
			query += "&openalex_id=eq.%s".formatted(openalexId.toUrlEncodedString());
		}
		String existingMentionsResponse = Utils.getAsAdmin(backendUrl + query);
		Collection<RsdMentionIds> existingIds = parseMultipleRsdIds(existingMentionsResponse);

		if (existingIds.size() > 1) {
			throw new RuntimeException("Multiple entries with DOI %s or OpenAlex id %s exist, they should be merged".formatted(openalexId, mention.doi()));
		}
		if (existingIds.size() == 1) {
			UUID id = existingIds.iterator().next().id();
			return updateMention(new RsdMentionRecord(id, mention, scrapedAt), true);
		}

		return createNewMention(mention, scrapedAt, true);
	}

	private RsdMentionIds createNewMention(ExternalMentionRecord mention, Instant scrapedAt, boolean setOpenAlexId) {
		JsonObject root = createJsonFromMentionData(mention, setOpenAlexId);
		root.addProperty("scraped_at", scrapedAt.toString());
		String response = Utils.postAsAdmin(backendUrl + "/mention?select=id,doi,openalex_id", root.toString(), "Prefer", "return=representation");
		return parseSingleRsdIds(response);
	}

	static JsonObject createJsonFromMentionData(ExternalMentionRecord mention, boolean setOpenAlexId) {
		JsonObject root = new JsonObject();
		Doi doi = mention.doi();
		root.addProperty("doi", doi == null ? null : mention.doi().toString());
		ZonedDateTime doiRegistrationDate = mention.doiRegistrationDate();
		root.addProperty("doi_registration_date", doiRegistrationDate == null ? null : doiRegistrationDate.toString());
		if (setOpenAlexId) {
			root.addProperty("openalex_id", mention.openalexId().toString());
		}
		URI url = mention.url();
		root.addProperty("url", url == null ? null : mention.url().toString());
		root.addProperty("title", mention.title());
		root.addProperty("authors", mention.authors());
		root.addProperty("publisher", mention.publisher());
		root.addProperty("publication_year", mention.publicationYear());
		root.addProperty("journal", mention.journal());
		root.addProperty("page", mention.page());
		root.addProperty("mention_type", mention.mentionType().name());
		root.addProperty("source", mention.source());
		root.addProperty("version", mention.version());
		root.addProperty("source", mention.source());

		return root;
	}
}
