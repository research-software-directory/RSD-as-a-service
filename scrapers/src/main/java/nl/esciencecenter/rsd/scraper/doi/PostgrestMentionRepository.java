package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.Instant;
import java.util.Collection;
import java.util.Objects;

public class PostgrestMentionRepository implements MentionRepository {

	private final String backendUrl;

	public PostgrestMentionRepository(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	static Collection<MentionRecord> parseJson(String data) {
		return new GsonBuilder()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.registerTypeAdapter(Instant.class, (JsonDeserializer) (json, typeOfT, context) -> Instant.parse(json.getAsString()))
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
		String scrapedMentionsJson = new GsonBuilder()
				.serializeNulls()
				.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
				.registerTypeAdapter(Instant.class, (JsonSerializer) (src, typeOfSrc, context) -> new JsonPrimitive(((Instant) src).toString()))
				.create().toJson(mentions);
		Utils.postAsAdmin(Config.backendBaseUrl() + "/mention?on_conflict=doi", scrapedMentionsJson, "Prefer", "resolution=merge-duplicates");
	}
}
