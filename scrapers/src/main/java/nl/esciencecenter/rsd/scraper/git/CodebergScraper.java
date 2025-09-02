// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.net.http.HttpResponse;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

public class CodebergScraper implements GitScraper {

	private static final Pattern codebergUrlPattern = Pattern.compile(
		"^https://([^\\s/]+)/([^\\s/]+)/([^\\s/]+)(\\.git)?$"
	);

	private final String baseApiUrl;
	private final CommitsPerWeek commitsPerWeek;

	/**
	 * This should only be called when not calling {@link #contributions()} later.
	 *
	 * @param url the Codeberg URL from which this scraper should be created, should have the form {@code https://<domain>/<owner>/<repo>}
	 * @return an instance of {@link CodebergScraper} if the url is valid
	 */
	public static Optional<CodebergScraper> fromUrl(String url) {
		return fromUrl(url, new CommitsPerWeek());
	}

	/**
	 * This must be called when calling {@link #contributions()} later.
	 *
	 * @param url the Codeberg URL from which this scraper should be created, should have the form {@code https://<domain>/<owner>/<repo>}
	 * @param commitsPerWeek the {@link CommitsPerWeek} to which commits should be appended to when calling {@link #contributions()}
	 * @return an instance of {@link CodebergScraper} if the url is valid and commitsPerWeek is not {@code null}
	 */
	public static Optional<CodebergScraper> fromUrl(String url, CommitsPerWeek commitsPerWeek) {
		if (url == null || commitsPerWeek == null) {
			return Optional.empty();
		}

		Matcher urlMatcher = codebergUrlPattern.matcher(url);
		if (!urlMatcher.find()) {
			return Optional.empty();
		}

		String baseUrl = "https://" + urlMatcher.group(1);
		String owner = urlMatcher.group(2);
		String repo = urlMatcher.group(3);

		return Optional.of(new CodebergScraper(baseUrl, owner, repo, commitsPerWeek));
	}

	private CodebergScraper(String baseUrl, String owner, String repo, CommitsPerWeek commitsPerWeek) {
		baseApiUrl = baseUrl + "/api/v1/repos/" + Utils.urlEncode(owner) + "/" + Utils.urlEncode(repo);
		this.commitsPerWeek = Objects.requireNonNull(commitsPerWeek);
	}

	// e.g. https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org
	@Override
	public BasicGitData basicData() throws IOException, InterruptedException, RsdResponseException {
		String response = Utils.get(baseApiUrl);

		return parseBasicData(response);
	}

	// e.g. https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org/languages
	@Override
	public String languages() throws IOException, InterruptedException, RsdResponseException {
		return Utils.get(baseApiUrl + "/languages");
	}

	// e.g. https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org/commits?limit=50
	// 50 is max limit, found out experimentally
	// from https://codeberg.org/api/swagger#/repository/repoGetAllCommits we can see that paginating is 1-based
	@Override
	public CommitsPerWeek contributions() throws IOException, InterruptedException, RsdResponseException {
		ZonedDateTime lastCommitHistoryTimestamp = commitsPerWeek.popLatestTimestamp();
		String baseUrl = baseApiUrl + "/commits?limit=50&page=";
		boolean hasMorePages = true;
		int page = 1;

		paginate: while (hasMorePages) {
			HttpResponse<String> response = Utils.getAsHttpResponse(baseUrl + page);
			hasMorePages = "true".equals(response.headers().firstValue("x-hasmore").orElse(""));
			++page;

			JsonArray thisPageCommits = JsonParser.parseString(response.body()).getAsJsonArray();
			for (JsonElement element : thisPageCommits) {
				JsonObject currentCommit = element.getAsJsonObject();
				String timeString = currentCommit.getAsJsonPrimitive("created").getAsString();
				ZonedDateTime time = ZonedDateTime.parse(timeString);
				if (lastCommitHistoryTimestamp != null && time.isBefore(lastCommitHistoryTimestamp)) {
					break paginate;
				}

				commitsPerWeek.addCommits(time, 1);
			}
		}

		return commitsPerWeek;
	}

	// e.g. https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org/collaborators
	// token required, unclear if you can see a repository's collaborators with your own token...
	@Override
	public Integer contributorCount() {
		throw new UnsupportedOperationException();
	}

	static BasicGitData parseBasicData(String data) {
		JsonObject jsonObject = JsonParser.parseString(data).getAsJsonObject();

		Boolean archived = jsonObject.getAsJsonPrimitive("archived").getAsBoolean();
		Long starCount = jsonObject.getAsJsonPrimitive("stars_count").getAsLong();
		Integer forkCount = jsonObject.getAsJsonPrimitive("forks_count").getAsInt();
		Integer openIssueCount = jsonObject.getAsJsonPrimitive("open_issues_count").getAsInt();

		return new BasicGitData(archived, null, starCount, forkCount, openIssueCount);
	}
}
