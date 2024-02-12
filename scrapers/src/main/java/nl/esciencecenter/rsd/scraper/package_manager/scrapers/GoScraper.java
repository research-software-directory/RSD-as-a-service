// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GoScraper implements PackageManagerScraper {

	final String packageName;
	private static final Pattern goPattern = Pattern.compile("https://pkg\\.go\\.dev/(\\S+?)/?");

	public GoScraper(String url) {
		Objects.requireNonNull(url);

		Matcher goMatcher = goPattern.matcher(url);
		if (goMatcher.matches()) {
			this.packageName = goMatcher.group(1);
			return;
		}

		throw new RuntimeException("Invalid Go URL: " + url);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	// Example URL: https://libraries.io/api/go/github.com%2Fgin-gonic%2Fgin
	// Example URL: https://libraries.io/api/go/google.golang.org%2Fgrpc
	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/go/" + Utils.urlEncode(packageName));
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
