// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

public class GithubSI implements SoftwareInfo {

	private final String baseApiUrl;
	private final String repo;

	public GithubSI(String baseApiUrl, String repo) {
		this.baseApiUrl = Objects.requireNonNull(baseApiUrl);
		this.repo = Objects.requireNonNull(repo);
	}

	/**
	 * Returns JSON as a String with the amount of lines written in each language.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/languages
	 */
	@Override
	public String languages() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		if (apiCredentials.isPresent()) {
			return Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		}
		else {
			return Utils.get(baseApiUrl + "/repos/" + repo + "/languages");
		}
	}

	/**
	 * Returns the license string of the repository.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service
	 */
	@Override
	public String license() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		String repoData;
		if (apiCredentials.isPresent()) {
			repoData = Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		}
		else {
			repoData = Utils.get(baseApiUrl + "/repos/" + repo);
		}
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
	 *
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/stats/contributors
	 */
	@Override
	public CommitsPerWeek contributions() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		HttpResponse<String> httpResponse = null;
		for (int i = 0; i < 2; i++) {
			if (apiCredentials.isPresent()) {
				httpResponse = Utils.getAsHttpResponse(baseApiUrl + "/repos/" + repo + "/stats/contributors", "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
			} else {
				httpResponse = Utils.getAsHttpResponse(baseApiUrl + "/repos/" + repo + "/stats/contributors");
			}

			if (httpResponse.statusCode() != 202) break;
			try {
				Thread.sleep(3000L);
			} catch (InterruptedException e) {
				throw new RuntimeException(e);
			}
		}

		int status = httpResponse.statusCode();
		if (status == 404) {
			System.out.println("Commit history not found at " + httpResponse.uri().toString());
			return null;
		} else if (status == 204) {
			// empty commit history
			return new CommitsPerWeek();
		} else if (status == 403) {
			throw new RsdRateLimitException("403 Forbidden. This error occurs mostly when the API rate limit is exceeded. Error message: " + httpResponse.body());
		} else if (status == 202) {
			// response not ready yet
			return null;
		} else if (status != 200){
			throw new RsdResponseException(status,
					"Unexpected response from " + httpResponse.uri().toString() + " with status code " + status + " and body " + httpResponse.body());
		} else {
			String contributionsJson = httpResponse.body();
			return parseCommits(contributionsJson);
		}
	}

	static CommitsPerWeek parseCommits(String json) {
		CommitsPerWeek commits = new CommitsPerWeek();
		JsonArray commitsPerContributor = JsonParser.parseString(json).getAsJsonArray();

		for (JsonElement jsonElement : commitsPerContributor) {
			JsonArray weeks = jsonElement.getAsJsonObject().getAsJsonArray("weeks");
			for (JsonElement week : weeks) {
				long weekTimestamp = week.getAsJsonObject().getAsJsonPrimitive("w").getAsLong();
				long commitsInWeek = week.getAsJsonObject().getAsJsonPrimitive("c").getAsLong();

				Instant weekInstant = Instant.ofEpochSecond(weekTimestamp);

				commits.addCommits(weekInstant, commitsInWeek);
			}
		}

		return commits;
	}
}
