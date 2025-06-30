// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
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

public class JuliaScraper implements PackageManagerScraper {

	private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(10);
	private final String packageName;
	private static final Pattern generalRegistryPattern = Pattern.compile("^https://github\\.com/JuliaRegistries/General/tree/master/[A-Z]/(\\w+)$");
	private static final Pattern ownRepoPattern = Pattern.compile("^https://github\\.com/[^/]+/(\\w+)\\.jl\\.git$");

	public JuliaScraper(String url) throws InvalidPackageManagerUrlException {
		Objects.requireNonNull(url);

		Matcher generalRegistryMatcher = generalRegistryPattern.matcher(url);
		if (generalRegistryMatcher.find()) {
			this.packageName = generalRegistryMatcher.group(1);
			return;
		}

		Matcher ownRepoMatcher = ownRepoPattern.matcher(url);
		if (ownRepoMatcher.find()) {
			this.packageName = ownRepoMatcher.group(1);
			return;
		}

		throw new InvalidPackageManagerUrlException(url);
	}

	@Override
	public Long downloads() throws IOException, RsdResponseException, InterruptedException {
		// example: https://juliapkgstats.com/api/v1/total_downloads/Makie
		URI url = URI.create("https://juliapkgstats.com/api/v1/total_downloads/" + packageName);

		try (HttpClient client = HttpClient.newBuilder().connectTimeout(DEFAULT_TIMEOUT).build()) {
			HttpRequest request = HttpRequest.newBuilder(url).timeout(DEFAULT_TIMEOUT).build();
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

			if (response.statusCode() != 200) {
				throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response getting Julia downloads for package: " + packageName);
			}

			String numberAsString = JsonParser.parseString(response.body())
				.getAsJsonObject()
				.getAsJsonPrimitive("total_requests")
				.getAsString()
				.replace(",", "");

			return Long.parseLong(numberAsString);
		}
	}

	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		// Although libraries.io supports Julia, it either returns 0 or doesn't have the package
		throw new UnsupportedOperationException();
	}
}
