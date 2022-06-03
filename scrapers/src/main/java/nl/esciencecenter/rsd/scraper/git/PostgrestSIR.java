package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

public class PostgrestSIR implements SoftwareInfoRepository {

	private final String backendUrl;
	private final CodePlatformProvider codePlatform;

	public PostgrestSIR(String backendUrl, CodePlatformProvider codePlatform) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
		this.codePlatform = Objects.requireNonNull(codePlatform);
	}

	/**
	 * Fetch programming languages data from PostgREST
	 * @param limit The number of rows requested from PostgREST
	 * @return      The data corresponding to the git repositories of which the programming languages data were scraped the longest time ago
	 */
	@Override
	public Collection<RepositoryUrlData> languagesData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "/repository_url?" + filter + "&order=languages_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseJsonData(data);
	}

	/**
	 * Fetch license data from PostgREST
	 * @param limit The number of rows requested from PostgREST
	 * @return      The data corresponding to the git repositories of which the license data were scraped the longest time ago
	 */
	@Override
	public Collection<RepositoryUrlData> licenseData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "/repository_url?" + filter + "&order=license_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseJsonData(data);
	}

	/**
	 * Fetch commit data from PostgREST
	 * @param limit The number of rows requested from PostgREST
	 * @return      The data corresponding to the git repositories of which the commit data were scraped the longest time ago
	 */
	@Override
	public Collection<RepositoryUrlData> commitData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "/repository_url?" + filter + "&order=commit_history_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseJsonData(data);
	}

	Collection<RepositoryUrlData> parseJsonData(String data) {
		JsonArray dataInArray = JsonParser.parseString(data).getAsJsonArray();
		Collection<RepositoryUrlData> result = new ArrayList<>();
		for (JsonElement element : dataInArray) {
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

			result.add(new RepositoryUrlData(software, url, codePlatform, license, licensScrapedAt, commits, commitsScrapedAt, languages, languagesScrapedAt));
		}
		return result;
	}

	@Override
	public void save(Collection<RepositoryUrlData> data) {
		String json = repositoryUrlDataToJson(data);
		Utils.postAsAdmin(backendUrl, json, "Prefer", "resolution=merge-duplicates");
	}

	static String repositoryUrlDataToJson(Collection<RepositoryUrlData> data) {
		JsonArray dataAsJsonArray = new JsonArray();
		for (RepositoryUrlData repositoryUrlData : data) {
			JsonObject newDataJson = new JsonObject();
//			we have to add all existing columns, otherwise PostgREST will not do the UPSERT
			newDataJson.addProperty("software", repositoryUrlData.software());
			newDataJson.addProperty("url", repositoryUrlData.url());
			newDataJson.addProperty("code_platform", repositoryUrlData.code_platform().name().toLowerCase());

			newDataJson.addProperty("license", repositoryUrlData.license());
			newDataJson.addProperty("license_scraped_at", repositoryUrlData.licenseScrapedAt() == null ? null : repositoryUrlData.licenseScrapedAt().toString());

			newDataJson.addProperty("commit_history", repositoryUrlData.commitHistory());
			newDataJson.addProperty("commit_history_scraped_at", repositoryUrlData.commitHistoryScrapedAt() == null ? null : repositoryUrlData.commitHistoryScrapedAt().toString());

			newDataJson.addProperty("languages", repositoryUrlData.languages());
			newDataJson.addProperty("languages_scraped_at", repositoryUrlData.languagesScrapedAt() == null ? null : repositoryUrlData.languagesScrapedAt().toString());
			dataAsJsonArray.add(newDataJson);
		}
		return dataAsJsonArray.toString();
	}
}
