// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

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

public class DockerHubScraper implements PackageManagerScraper {

	private final String owner;
	private final String packageName;
	private static final Pattern urlPattern = Pattern.compile("https://hub\\.docker\\.com/(r/)?([^/]+)/([^/]+)/?");

	public DockerHubScraper(String url) {
		Objects.requireNonNull(url);
		Matcher urlMatcher = urlPattern.matcher(url);
		if (!urlMatcher.matches()) {
			throw new RuntimeException("Invalid Docker Hub URL: " + url);
		}

		owner = urlMatcher.group(2);
		packageName = urlMatcher.group(3);
	}

	@Override
	public Long downloads() throws RsdResponseException {
		String url;
		if (owner.equals("_")) url = "https://hub.docker.com/v2/repositories/library/" + packageName;
		else url = "https://hub.docker.com/v2/repositories/" + owner + "/" + packageName;
		HttpClient client = HttpClient.newBuilder()
				.followRedirects(HttpClient.Redirect.NORMAL)
				.build();
		HttpRequest request = HttpRequest.newBuilder(URI.create(url))
				.timeout(Duration.ofSeconds(30))
				.build();
		String json;
		try {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			json = switch (response.statusCode()) {
				case 200 -> response.body();
				default ->
						throw new RsdResponseException(response.statusCode(), request.uri(), response.body(), "Unexpected response");
			};
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		return parseDowloadsResponse(json);
	}

	@Override
	public Integer reverseDependencies() {
		throw new UnsupportedOperationException();
	}

	Long parseDowloadsResponse(String json) {
		return JsonParser.parseString(json).getAsJsonObject().getAsJsonPrimitive("pull_count").getAsLong();
	}
}
