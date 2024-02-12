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

public class MavenScraper implements PackageManagerScraper {

	final String groupId;
	final String artifactId;
	private static final Pattern mvnPattern = Pattern.compile("https://mvnrepository\\.com/artifact/([^/]+)/([^/]+)/?");
	private static final Pattern sonatypePattern = Pattern.compile("https://central\\.sonatype\\.com/artifact/([^/]+)/([^/]+)/?");

	public MavenScraper(String url) {
		Objects.requireNonNull(url);

		Matcher mvnMatcher = mvnPattern.matcher(url);
		if (mvnMatcher.matches()) {
			groupId = mvnMatcher.group(1);
			artifactId = mvnMatcher.group(2);
			return;
		}

		Matcher sonatypeMatcher = sonatypePattern.matcher(url);
		if (sonatypeMatcher.matches()) {
			groupId = sonatypeMatcher.group(1);
			artifactId = sonatypeMatcher.group(2);
			return;
		}

		throw new RuntimeException("Invalid Maven URL: " + url);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	// Example URL: https://libraries.io/api/maven/io.github.sanctuuary:APE
	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/maven/" + groupId + ":" + artifactId);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
