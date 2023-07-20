// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PypiScraper implements PackageManagerScraper {

	private final String packageName;
	private static final Pattern urlPattern = Pattern.compile("https://pypi\\.org/project/([^/]+)/?");

	public PypiScraper(String url) {
		Objects.requireNonNull(url);
		Matcher urlMatcher = urlPattern.matcher(url);
		if (!urlMatcher.matches()) {
			throw new RuntimeException("Invalid PyPi URL: " + url);
		}

		packageName = urlMatcher.group(1);
	}

	@Override
	public Long downloads() {
		HttpClient client = HttpClient.newBuilder()
				.followRedirects(HttpClient.Redirect.NORMAL)
				.build();
		HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.pepy.tech/api/v2/projects/" + packageName))
				.timeout(Duration.ofSeconds(30))
				.build();
		try {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() == 404) throw new RsdResponseException(response.statusCode(), request.uri(), response.body(), "Not found, is the URL correct?");
			else if (response.statusCode() != 200) throw new RsdResponseException(response.statusCode(), request.uri(), response.body(), "Unexpected response");

			JsonElement tree = JsonParser.parseString(response.body());
			return tree.getAsJsonObject().getAsJsonPrimitive("total_downloads").getAsLong();
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public Integer reverseDependencies() {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/pypi/" + packageName);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
