// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MavenScraper implements PackageManagerScraper {

	private final String groupId;
	private final String artifactId;
	private static final Pattern urlPattern = Pattern.compile("https://mvnrepository\\.com/artifact/([^/]+)/([^/]+)/?");

	public MavenScraper(String url) {
		Objects.requireNonNull(url);
		Matcher urlMatcher = urlPattern.matcher(url);
		if (!urlMatcher.matches()) {
			throw new RuntimeException("Invalid Maven URL: " + url);
		}

		groupId = urlMatcher.group(1);
		artifactId = urlMatcher.group(2);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/maven/" + groupId + ":" + artifactId);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
