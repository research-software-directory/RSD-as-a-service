// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.license;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class GitHubSpdxLicenseRepository {

	private static final Gson gson = new Gson();

	private GitHubSpdxLicenseRepository() {
	}

	public static Map<String, SpdxLicense> getLicensesByIdMap() throws IOException, InterruptedException, RsdResponseException {
		String url = "https://raw.githubusercontent.com/spdx/license-list-data/refs/heads/main/json/licenses.json";

		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		if (response.statusCode() != 200) {
			throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response while getting SPDX licenses");
		}

		String json = response.body();
		return parseLicensesJson(json);
	}

	static Map<String, SpdxLicense> parseLicensesJson(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray licensesJsonArray = root.getAsJsonArray("licenses");
		TypeToken<List<SpdxLicense>> spdxListTypeToken = new TypeToken<>() {
		};
		List<SpdxLicense> licenses = gson.fromJson(licensesJsonArray, spdxListTypeToken);

		return licenses
			.stream()
			.collect(Collectors.toMap(SpdxLicense::licenseId, Function.identity()));
	}
}
