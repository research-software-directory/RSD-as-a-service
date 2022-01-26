package nl.esciencecenter.rsd.scraper.language;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

public class PostgrestPLR implements ProgrammingLanguagesRepository {

	private final String baseUrl;

	public PostgrestPLR(String baseUrl) {
		this.baseUrl = Objects.requireNonNull(baseUrl);
	}

	@Override
	public Collection<RepositoryUrlData> data() {
		JsonArray data = JsonParser.parseString(Utils.getAsAdmin(baseUrl)).getAsJsonArray();
		Collection<RepositoryUrlData> result = new ArrayList<>();
		for (JsonElement element : data) {
			JsonObject jsonObject = element.getAsJsonObject();
			String id = jsonObject.getAsJsonPrimitive("id").getAsString();
			String url = jsonObject.getAsJsonPrimitive("url").getAsString();
			String programmingLanguagesData = null;
			LocalDateTime updatedAt = null;
			JsonArray programmingLanguages = jsonObject.getAsJsonArray("programming_languages");
			if (!programmingLanguages.isEmpty()) {
				programmingLanguagesData = programmingLanguages.get(0).getAsJsonObject().getAsJsonPrimitive("languages").getAsString();
				updatedAt = LocalDateTime.parse(programmingLanguages.get(0).getAsJsonObject().getAsJsonPrimitive("updated_at").getAsString());
			}
			result.add(new RepositoryUrlData(id, url, programmingLanguagesData, updatedAt));
		}
		return result;
	}

	@Override
	public void save(String data) {
		Utils.postAsAdmin(baseUrl, data, "Prefer", "resolution=merge-duplicates");
	}
}
