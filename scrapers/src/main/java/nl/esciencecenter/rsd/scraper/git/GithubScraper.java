// SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GithubScraper implements GitScraper {

	private static final String BASE_API_URL = "https://api.github.com";
	public final String organisation;
	public final String repo;
	private static final Pattern LINK_PATTERN = Pattern.compile("<([^>]+page=(\\d+)[^>]*)>; rel=\"([^\"]+)\"");
	private static final Pattern GITHUB_URL_PATTERN = Pattern.compile("^https?://github\\.com/([^\\s/]+)/([^\\s/]+)/?$");

	private GithubScraper(String organisation, String repo) {
		this.organisation = Objects.requireNonNull(organisation);
		if (repo.endsWith(".git")) {
			repo = repo.substring(0, repo.length() - 4);
		}
		this.repo = Objects.requireNonNull(repo);
	}

	public static Optional<GithubScraper> create(String url) {
		Matcher matcher = GITHUB_URL_PATTERN.matcher(url);
		if (!matcher.find()) {
			return Optional.empty();
		}

		String organisation = matcher.group(1);
		String repo = matcher.group(2);
		GithubScraper githubScraper = new GithubScraper(organisation, repo);
		return Optional.of(githubScraper);
	}

	/**
	 * Returns the basic data of the repository.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service
	 */
	@Override
	public BasicGitData basicData() throws IOException, InterruptedException, RsdResponseException {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		HttpResponse<String> response;
		if (apiCredentials.isPresent()) {
			response = Utils.getAsHttpResponse(BASE_API_URL + "/repos/" + organisation + "/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		} else {
			response = Utils.getAsHttpResponse(BASE_API_URL + "/repos/" + organisation + "/" + repo);
		}
		return switch (response.statusCode()) {
			case 200 -> parseBasicData(response.body());
			case 404 ->
				throw new RsdResponseException(404, response.uri(), response.body(), "Not found, is the repository URL correct?");
			case 403 ->
				throw new RsdRateLimitException(403, response.uri(), response.body(), "Rate limit for GitHub probably reached");
			default ->
				throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response");
		};
	}

	/**
	 * Returns JSON as a String with the amount of lines written in each language.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/languages
	 */
	@Override
	public String languages() throws IOException, InterruptedException, RsdResponseException {
		HttpResponse<String> response = getAsHttpResponse(BASE_API_URL + "/repos/" + organisation + "/" + repo + "/languages");
		return switch (response.statusCode()) {
			case 404 ->
				throw new RsdResponseException(404, response.uri(), response.body(), "Not found, is the repository URL correct?");
			case 403 ->
				throw new RsdRateLimitException(403, response.uri(), response.body(), "Rate limit for GitHub probably reached");
			case 200 -> response.body();
			default ->
				throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response");
		};
	}

	/**
	 * Returns  all contributors commit activity.
	 * https://docs.github.com/en/rest/reference/metrics#get-all-contributor-commit-activity=
	 * Requesting commit activity requires a GitHub authentication token.
	 * <p>
	 * The returned string represents a JsonArray with one entry per contributor. THe information
	 * per entry are:
	 * <p>
	 * {
	 * "author": { <AuthorInformation> },
	 * "total": number of total commits,
	 * "weeks": [
	 * {
	 * "w": unix timestamp (Start of the week 00:00 on Sundays),
	 * "a": number of additions,
	 * "d": number of deletions,
	 * "c": number of commits
	 * }, ...
	 * ]
	 * }
	 * <p>
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/stats/contributors
	 */
	@Override
	public CommitsPerWeek contributions() throws IOException, InterruptedException, RsdResponseException {
		HttpResponse<String> httpResponse = null;
		for (int i = 0; i < 2; i++) {
			httpResponse = getAsHttpResponse(BASE_API_URL + "/repos/" + organisation + "/" + repo + "/stats/contributors");

			if (httpResponse.statusCode() != 202) break;
			Thread.sleep(3000L);
		}

		int status = httpResponse.statusCode();
		if (status == 404) {
			throw new RsdResponseException(status, httpResponse.uri(), httpResponse.body(), "Not found, is the repository URL correct?");
		} else if (status == 204) {
			// empty commit history
			return new CommitsPerWeek();
		} else if (status == 403) {
			throw new RsdRateLimitException(403, httpResponse.uri(), httpResponse.body(), "Rate limit for GitHub probably reached");
		} else if (status == 202) {
			// response not ready yet
			return null;
		} else if (status != 200) {
			throw new RsdResponseException(status, httpResponse.uri(), httpResponse.body(), "Unexpected response");
		} else {
			String contributionsJson = httpResponse.body();
			return parseCommits(contributionsJson);
		}
	}

	// Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/contributors?per_page=1
	@Override
	public Integer contributorCount() throws IOException, InterruptedException, RsdResponseException {
		// we request one contributor per page and just extract the number of pages from the headers
		// see https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api?apiVersion=2022-11-28
		HttpResponse<String> httpResponse = getAsHttpResponse(BASE_API_URL + "/repos/" + organisation + "/" + repo + "/contributors?per_page=1");

		int status = httpResponse.statusCode();
		if (status == 404) {
			throw new RsdResponseException(404, httpResponse.uri(), httpResponse.body(), "Not found, is the repository URL correct?");
		} else if (status == 403) {
			throw new RsdRateLimitException(403, httpResponse.uri(), httpResponse.body(), "Rate limit for GitHub probably reached");
		} else if (status != 200) {
			throw new RsdResponseException(status, httpResponse.uri(), httpResponse.body(), "Unexpected response");
		} else {
			List<String> linkHeaders = httpResponse.headers().allValues("link");
			String[] lastPageData = lastPageFromLinkHeader(linkHeaders);
			if (lastPageData != null) {
				int lastPageNumber = Integer.parseInt(lastPageData[1]);
				return lastPageNumber;
			} else {
				// this was the first page, return the size of the array (either 0 or 1)
				return JsonParser.parseString(httpResponse.body()).getAsJsonArray().size();
			}
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

	static BasicGitData parseBasicData(String json) {
		JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();

		Boolean archived = jsonObject.getAsJsonPrimitive("archived").getAsBoolean();
		JsonElement jsonLicense = jsonObject.get("license");
		String license = jsonLicense.isJsonNull() ? null : jsonLicense.getAsJsonObject()
			.getAsJsonPrimitive("spdx_id")
			.getAsString();
		Long starCount = jsonObject.getAsJsonPrimitive("stargazers_count").getAsLong();
		Integer forkCount = jsonObject.getAsJsonPrimitive("forks_count").getAsInt();
		Integer openIssueCount = jsonObject.getAsJsonPrimitive("open_issues_count").getAsInt();

		return new BasicGitData(
			archived,
			license,
			starCount,
			forkCount,
			openIssueCount
		);
	}

	// return an object with the URL of the last page and the number of the last page respectively
	static String[] lastPageFromLinkHeader(List<String> links) {
		if (links.isEmpty()) return null;

		for (String link : links) {
			Matcher matcher = LINK_PATTERN.matcher(link);
			while (matcher.find()) {
				String relation = matcher.group(3);
				if (relation.equals("last")) return new String[]{matcher.group(1), matcher.group(2)};
			}
		}

		throw new RuntimeException("No last page found");
	}

	static HttpResponse<String> getAsHttpResponse(String url) throws IOException, InterruptedException {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		if (apiCredentials.isPresent()) {
			return Utils.getAsHttpResponse(url, "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		} else {
			return Utils.getAsHttpResponse(url);
		}
	}
}
