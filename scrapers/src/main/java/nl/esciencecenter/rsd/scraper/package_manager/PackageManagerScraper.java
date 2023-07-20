// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Optional;

public interface PackageManagerScraper {

	Long downloads();

	Integer reverseDependencies();

	static String doLibrariesIoRequest(String url) {
		Optional<String> optionalApiKey = Config.librariesIoKey();
		if (optionalApiKey.isPresent()) url += "?api_key=" + optionalApiKey.get();

		HttpClient client = HttpClient.newBuilder()
				.followRedirects(HttpClient.Redirect.NORMAL)
				.build();
		HttpRequest request = HttpRequest.newBuilder(URI.create(url))
				.timeout(Duration.ofSeconds(30))
				.build();
		try {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			return switch (response.statusCode()) {
				case 429 -> throw new RsdRateLimitException(429, request.uri(), response.body(), "Rate limit reached for libraries.io");
				case 404 -> throw new RsdResponseException(404, request.uri(), response.body(), "Not found, is the URL correct?");
				case 200 -> response.body();
				default ->
						throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response");
			};
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
	}
}
