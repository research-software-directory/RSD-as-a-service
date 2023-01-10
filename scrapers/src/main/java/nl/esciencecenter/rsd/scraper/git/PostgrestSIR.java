// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.UUID;

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
	public Collection<BasicRepositoryData> languagesData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "?" + filter + "&select=software,url&order=languages_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseBasicJsonData(data);
	}

	/**
	 * Fetch license data from PostgREST
	 * @param limit The number of rows requested from PostgREST
	 * @return      The data corresponding to the git repositories of which the license data were scraped the longest time ago
	 */
	@Override
	public Collection<BasicRepositoryData> licenseData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "?" + filter + "&select=software,url&order=license_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseBasicJsonData(data);
	}

	/**
	 * Fetch commit data from PostgREST
	 * @param limit The number of rows requested from PostgREST
	 * @return      The data corresponding to the git repositories of which the commit data were scraped the longest time ago
	 */
	@Override
	public Collection<BasicRepositoryData> commitData(int limit) {
		String filter = "code_platform=eq." + codePlatform.name().toLowerCase();
		String data = Utils.getAsAdmin(backendUrl + "?" + filter + "&select=software,url&order=commit_history_scraped_at.asc.nullsfirst&limit=" + limit);
		return parseBasicJsonData(data);
	}

	static Collection<BasicRepositoryData> parseBasicJsonData(String data) {
		JsonArray dataInArray = JsonParser.parseString(data).getAsJsonArray();
		Collection<BasicRepositoryData> result = new ArrayList<>();
		for (JsonElement element : dataInArray) {
			JsonObject jsonObject = element.getAsJsonObject();
			String softwareUuid = jsonObject.getAsJsonPrimitive("software").getAsString();
			UUID software = UUID.fromString(softwareUuid);
			String url = jsonObject.getAsJsonPrimitive("url").getAsString();

			result.add(new BasicRepositoryData(software, url));
		}
		return result;
	}

	@Override
	public void saveLicenseData(LicenseData licenseData) {
		String json;
		if (licenseData.license() == null) {
			json = String.format("{\"license_scraped_at\": \"%s\"}", licenseData.licenseScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		} else {
			json = String.format("{\"license\": \"%s\", \"license_scraped_at\": \"%s\"}", licenseData.license(), licenseData.licenseScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		}
		Utils.patchAsAdmin(backendUrl + "?software=eq." + licenseData.basicData().software().toString(), json);
	}

	@Override
	public void saveLanguagesData(LanguagesData languagesData) {
		String json;
		if (languagesData.languages() == null) {
			json = String.format("{\"languages_scraped_at\": \"%s\"}", languagesData.languagesScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		} else {
			json = String.format("{\"languages\": %s, \"languages_scraped_at\": \"%s\"}", languagesData.languages(), languagesData.languagesScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		}
		Utils.patchAsAdmin(backendUrl + "?software=eq." + languagesData.basicData().software().toString(), json);
	}

	@Override
	public void saveCommitData(CommitData commitData) {
		String json;
		if (commitData.commitHistory() == null) {
			json = String.format("{\"commit_history_scraped_at\": \"%s\"}", commitData.commitHistoryScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		} else {
			commitData.commitHistory().addMissingZeros();
			json = String.format("{\"commit_history\": %s, \"commit_history_scraped_at\": \"%s\"}", commitData.commitHistory().toJson(), commitData.commitHistoryScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		}
		Utils.patchAsAdmin(backendUrl + "?software=eq." + commitData.basicData().software().toString(), json);
	}
}
