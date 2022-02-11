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
	public Collection<RepositoryUrlData> languagesData() {
		return licenseData();
	}

	@Override
	public Collection<RepositoryUrlData> licenseData() {
		JsonArray data = JsonParser.parseString(Utils.getAsAdmin(baseUrl + "/repository_url")).getAsJsonArray();
		Collection<RepositoryUrlData> result = new ArrayList<>();
		for (JsonElement element : data) {
			JsonObject jsonObject = element.getAsJsonObject();
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

			JsonElement jsonLanguages = jsonObject.get("languages");
			String languages = jsonLanguages.isJsonNull() ? null : jsonLanguages.getAsString();
			JsonElement jsonLanguagesScrapedAt = jsonObject.get("languages_scraped_at");
			LocalDateTime languagesScrapedAt = jsonLanguagesScrapedAt.isJsonNull() ? null : LocalDateTime.parse(jsonLanguagesScrapedAt.getAsString());

			result.add(new RepositoryUrlData(software, url, license, licensScrapedAt, commits, commitsScrapedAt, languages, languagesScrapedAt));
		}
		return result;
	}

	@Override
	public Collection<RepositoryUrlData> commitData() {
		return licenseData();
	}

	@Override
	public void save(Collection<RepositoryUrlData> data) {
		JsonArray dataAsJsonArray = new JsonArray();
		for (RepositoryUrlData repositoryUrlData : data) {
			JsonObject newDataJson = new JsonObject();
//			we have to add all existing columns, otherwise PostgREST will not do the UPSERT
			newDataJson.addProperty("software", repositoryUrlData.software());
			newDataJson.addProperty("url", repositoryUrlData.url());

			newDataJson.addProperty("license", repositoryUrlData.license());
			newDataJson.addProperty("license_scraped_at", repositoryUrlData.licenseScrapedAt() == null ? null : repositoryUrlData.licenseScrapedAt().toString());

			newDataJson.addProperty("commit_history", repositoryUrlData.commitHistory());
			newDataJson.addProperty("commit_history_scraped_at", repositoryUrlData.commitHistoryScrapedAt() == null ? null : repositoryUrlData.commitHistoryScrapedAt().toString());

			newDataJson.addProperty("languages", repositoryUrlData.languages());
			newDataJson.addProperty("languages_scraped_at", repositoryUrlData.languagesScrapedAt() == null ? null : repositoryUrlData.languagesScrapedAt().toString());
			dataAsJsonArray.add(newDataJson);
		}
		Utils.postAsAdmin(baseUrl, dataAsJsonArray.toString(), "Prefer", "resolution=merge-duplicates");
	}
}
