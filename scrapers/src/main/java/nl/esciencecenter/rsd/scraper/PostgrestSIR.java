package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

public class PostgrestSIR implements SoftwareInfoRepository {

	private final String baseUrl;

	public PostgrestSIR(String baseUrl) {
		this.baseUrl = Objects.requireNonNull(baseUrl);
	}

	@Override
	public Collection<ProgrammingLanguageData> repositoryUrlData() {
		JsonArray data = JsonParser.parseString(Utils.getAsAdmin(baseUrl + "/repository_url?select=id,url,programming_languages(updated_at)")).getAsJsonArray();
		Collection<ProgrammingLanguageData> result = new ArrayList<>();
		for (JsonElement element : data) {
			JsonObject jsonObject = element.getAsJsonObject();
			String id = jsonObject.getAsJsonPrimitive("id").getAsString();
			String url = jsonObject.getAsJsonPrimitive("url").getAsString();
			LocalDateTime updatedAt = null;
			JsonArray programmingLanguages = jsonObject.getAsJsonArray("programming_languages");
			if (!programmingLanguages.isEmpty()) {
				updatedAt = LocalDateTime.parse(programmingLanguages.get(0).getAsJsonObject().getAsJsonPrimitive("updated_at").getAsString());
			}
			result.add(new ProgrammingLanguageData(id, url, updatedAt));
		}
		return result;
	}

	@Override
	public Collection<RepositoryUrlData> licenseData() {
		JsonArray data = JsonParser.parseString(Utils.getAsAdmin(baseUrl + "/repository_url")).getAsJsonArray();
		Collection<RepositoryUrlData> result = new ArrayList<>();
		for (JsonElement element : data) {
			JsonObject jsonObject = element.getAsJsonObject();
			String id = jsonObject.getAsJsonPrimitive("id").getAsString();
			String software = jsonObject.getAsJsonPrimitive("software").getAsString();
			String url = jsonObject.getAsJsonPrimitive("url").getAsString();

			JsonElement jsonLicence = jsonObject.get("license");
			String license = jsonLicence.isJsonNull() ? null : jsonLicence.getAsString();
			JsonElement jsonLicenseScrapedAt = jsonObject.get("license_scraped_at");
			LocalDateTime licensScrapedAt = jsonLicenseScrapedAt.isJsonNull() ? null : LocalDateTime.parse(jsonLicenseScrapedAt.getAsString());

			JsonElement jsonCommits = jsonObject.get("commit_history");
			String commits = jsonCommits.isJsonNull() ? null : jsonCommits.getAsString();
			JsonElement jsonCommitsScrapedAt = jsonObject.get("commit_history_scraped_at");
			LocalDateTime commitsScrapedAt = jsonCommitsScrapedAt.isJsonNull() ? null : LocalDateTime.parse(jsonCommitsScrapedAt.getAsString());

			result.add(new RepositoryUrlData(id, software, url, license, licensScrapedAt, commits, commitsScrapedAt));
		}
		return result;
	}

	@Override
	public Collection<RepositoryUrlData> commitData() {
		return licenseData();
	}

	@Override
	public void save(String data) {
		Utils.postAsAdmin(baseUrl, data, "Prefer", "resolution=merge-duplicates");
	}
}
