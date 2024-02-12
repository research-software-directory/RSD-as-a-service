// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
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

public class CratesScraper implements PackageManagerScraper {

	final String packageName;
	private static final Pattern cratesPattern = Pattern.compile("https://crates\\.io/crates/([^/]+)/?");

	public CratesScraper(String url) {
		Objects.requireNonNull(url);

		Matcher cratesMatcher = cratesPattern.matcher(url);
		if (cratesMatcher.matches()) {
			this.packageName = cratesMatcher.group(1);
			return;
		}

		throw new RuntimeException("Invalid crates.io URL: " + url);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	// Example URL: https://libraries.io/api/cargo/tokio
	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/cargo/" + packageName);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
