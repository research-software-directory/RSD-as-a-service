// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

public class PixiScraper implements PackageManagerScraper {

	private final String channelName;
	private final String packageName;
	private static final Pattern urlPattern = Pattern.compile("https://prefix\\.dev/channels/([^/]+)/packages/([^/]+)");

	public PixiScraper(String url) {
		Objects.requireNonNull(url);
		Matcher urlMatcher = urlPattern.matcher(url);
		if (!urlMatcher.matches()) {
			throw new RuntimeException("Invalid Pixi URL: " + url);
		}

		channelName = urlMatcher.group(1);
		packageName = urlMatcher.group(2);
	}

	@Override
	public Long downloads() throws RsdResponseException {
		String graphqlQuery = String.format("""
				{
					package(channelName: "%s", name: "%s") {
						downloadCounts {
							version
							count
						}
					}
				}
				""",
				channelName,
				packageName);
		JsonObject body = new JsonObject();
		body.addProperty("query", graphqlQuery);
		String response = Utils.post("https://prefix.dev/api/graphql", body.toString(), "Content-Type", "application/json");
		JsonObject jsonObject = JsonParser.parseString(response).getAsJsonObject();
		JsonArray countItems = jsonObject.getAsJsonObject("data").getAsJsonObject("package").getAsJsonArray("downloadCounts");

		long downloadsSum = 0;
		for (JsonElement item : countItems) {
			int count = item.getAsJsonObject().get("count").getAsInt();
			downloadsSum += count;
		}

		return downloadsSum;
	}

	@Override
	public Integer reverseDependencies() {
		throw new UnsupportedOperationException();
	}

}
