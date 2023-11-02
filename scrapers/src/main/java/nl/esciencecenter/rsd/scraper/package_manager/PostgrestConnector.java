// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

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

public class PostgrestConnector {

	private final String backendUrl;

	public PostgrestConnector(String backendUrl) {
		this.backendUrl = Objects.requireNonNull(backendUrl);
	}

	public Collection<BasicPackageManagerData> oldestDownloadCounts(int limit) {
		String filter = "or=(package_manager.eq.dockerhub)";
		String data = Utils.getAsAdmin(backendUrl + "?" + filter + "&select=id,url,package_manager&order=download_count_scraped_at.asc.nullsfirst&limit=" + limit + "&" + Utils.atLeastOneHourAgoFilter("download_count_scraped_at"));
		return parseBasicJsonData(data);
	}

	public Collection<BasicPackageManagerData> oldestReverseDependencyCounts(int limit) {
		String filter = "or=(package_manager.eq.anaconda,package_manager.eq.cran,package_manager.eq.maven,package_manager.eq.npm,package_manager.eq.pypi)";
		String data = Utils.getAsAdmin(backendUrl + "?" + filter + "&select=id,url,package_manager&order=reverse_dependency_count_scraped_at.asc.nullsfirst&limit=" + limit + "&" + Utils.atLeastOneHourAgoFilter("reverse_dependency_count_scraped_at"));
		return parseBasicJsonData(data);
	}

	public void saveDownloadCount(UUID id, Long count, ZonedDateTime scrapedAt) {
		String json = "{\"download_count\": %s, \"download_count_scraped_at\": \"%s\"}".formatted(count, scrapedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		Utils.patchAsAdmin(backendUrl + "?id=eq." + id, json);
	}

	public void saveReverseDependencyCount(UUID id, Integer count, ZonedDateTime scrapedAt) {
		String json = "{\"reverse_dependency_count\": %s, \"reverse_dependency_count_scraped_at\": \"%s\"}".formatted(count, scrapedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		Utils.patchAsAdmin(backendUrl + "?id=eq." + id, json);
	}

	Collection<BasicPackageManagerData> parseBasicJsonData(String json) {
		JsonArray dataInArray = JsonParser.parseString(json).getAsJsonArray();
		Collection<BasicPackageManagerData> result = new ArrayList<>();
		for (JsonElement element : dataInArray) {
			JsonObject jsonObject = element.getAsJsonObject();
			String idString = jsonObject.getAsJsonPrimitive("id").getAsString();
			UUID id = UUID.fromString(idString);
			String url = jsonObject.getAsJsonPrimitive("url").getAsString();
			PackageManagerType type = PackageManagerType.valueOf(jsonObject.getAsJsonPrimitive("package_manager").getAsString());

			result.add(new BasicPackageManagerData(id, url, type));
		}
		return result;
	}
}
