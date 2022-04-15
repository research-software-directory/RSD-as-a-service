package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

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
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors"));
	}
}
