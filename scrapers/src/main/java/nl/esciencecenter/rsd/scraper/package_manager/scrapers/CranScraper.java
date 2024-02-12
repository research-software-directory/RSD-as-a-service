// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import nl.esciencecenter.rsd.scraper.RsdResponseException;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CranScraper implements PackageManagerScraper {

	final String packageName;
	private static final Pattern urlPattern1 = Pattern.compile("https://cran\\.r-project\\.org/web/packages/([^/\\s]+)/?(index\\.html/?)?", Pattern.CASE_INSENSITIVE);
	private static final Pattern urlPattern2 = Pattern.compile("https://cran\\.r-project\\.org/package=([^/\\s]+)/?", Pattern.CASE_INSENSITIVE);

	public CranScraper(String url) {
		Objects.requireNonNull(url);

		Matcher urlMatcher1 = urlPattern1.matcher(url);
		if (urlMatcher1.matches()) {
			packageName = urlMatcher1.group(1);
			return;
		}

		Matcher urlMatcher2 = urlPattern2.matcher(url);
		if (urlMatcher2.matches()) {
			packageName = urlMatcher2.group(1);
			return;
		}

		throw new RuntimeException("Invalid CRAN URL: " + url);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/cran/" + packageName);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
