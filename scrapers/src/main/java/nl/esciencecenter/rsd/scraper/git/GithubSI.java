// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.ResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.util.Objects;

public class GithubSI implements SoftwareInfo {

	private final String baseApiUrl;
	private final String repo;

	public GithubSI(String baseApiUrl, String repo) {
		this.baseApiUrl = Objects.requireNonNull(baseApiUrl);
		this.repo = Objects.requireNonNull(repo);
	}

	/**
	 * Returns JSON as a String with the amount of lines written in each language.
	 */
	@Override
	public String languages() {
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages"));
	}

	/**
	 * Returns the license string of the repository.
	 */
	@Override
	public String license() {
		String repoData = Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo));
		JsonElement jsonLicense = JsonParser.parseString(repoData).getAsJsonObject().get("license");
		return jsonLicense.isJsonNull() ? null : jsonLicense.getAsJsonObject().getAsJsonPrimitive("spdx_id").getAsString();
	}

	/**
	 * Returns  all contributors commit activity.
	 * https://docs.github.com/en/rest/reference/metrics#get-all-contributor-commit-activity=
	 * Requesting commit activity requires a GitHub authentication token.
	 *
	 * The returned string represents a JsonArray with one entry per contributor. THe information
	 * per entry are:
	 *
	 * {
	 *     "author": { <AuthorInformation> },
	 *     "total": number of total commits,
	 *     "weeks": [
	 *         {
	 *             "w": unix timestamp (Start of the week 00:00 on Sundays),
	 *             "a": number of additions,
	 *             "d": number of deletions,
	 *             "c": number of commits
	 *         }, ...
	 *     ]
	 * }
	 */
	@Override
	public String contributions() {
		String contributions = "";
		try {
			contributions = Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors"));
                        if ( contributions.equals("") ) {
                                // Repository exists, but no contributions yet, empty list is more appropriate
                                contributions = "[]";
                        }
		} catch (ResponseException e) {
			if (e.getStatusCode() == 404) {
                                // Repository does not exist, emtpy string will be parsed to null
				contributions = "";
			}
		}
		return contributions;
	}
}
