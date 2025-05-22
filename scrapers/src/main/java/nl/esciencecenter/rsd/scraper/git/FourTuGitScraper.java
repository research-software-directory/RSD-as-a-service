// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.Objects;

public class FourTuGitScraper implements GitScraper {
	private final String repoUrl;

	public FourTuGitScraper(String repoUrl) {
		this.repoUrl = Objects.requireNonNull(repoUrl);
	}

	@Override
	public BasicGitData basicData() throws IOException, InterruptedException, RsdResponseException {
		throw new UnsupportedOperationException();
	}

	// Example URL: https://data.4tu.nl/v3/datasets/454afe4e-08aa-4333-b6e8-7db7cebd0f83.git/languages
	@Override
	public String languages() throws IOException, InterruptedException, RsdResponseException {
		String url = repoUrl + "/languages";
		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		return switch (response.statusCode()) {
			case 404 ->
					throw new RsdResponseException(404, response.uri(), response.body(), "Not found, is the repository URL correct?");
			case 200 -> response.body();
			default ->
					throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response when downloading 4TU programming languages");
		};
	}

	// Example URL: https://data.4tu.nl/v3/datasets/454afe4e-08aa-4333-b6e8-7db7cebd0f83.git/contributors
	@Override
	public CommitsPerWeek contributions() throws IOException, InterruptedException, RsdResponseException {
		String url = repoUrl + "/contributors";
		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		return switch (response.statusCode()) {
			case 404 ->
					throw new RsdResponseException(404, response.uri(), response.body(), "Not found, is the repository URL correct?");
			case 200 -> GithubScraper.parseCommits(response.body());
			default ->
					throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response when downloading 4TU commit history");
		};
	}

	// Example URL: https://data.4tu.nl/v3/datasets/454afe4e-08aa-4333-b6e8-7db7cebd0f83.git/contributors
	@Override
	public Integer contributorCount() throws IOException, InterruptedException, RsdResponseException {
		String url = repoUrl + "/contributors";
		HttpResponse<String> response = Utils.getAsHttpResponse(url);
		return switch (response.statusCode()) {
			case 404 ->
					throw new RsdResponseException(404, response.uri(), response.body(), "Not found, is the repository URL correct?");
			case 200 -> JsonParser.parseString(response.body()).getAsJsonArray().size();
			default ->
					throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response when downloading 4TU commit history");
		};
	}
}
