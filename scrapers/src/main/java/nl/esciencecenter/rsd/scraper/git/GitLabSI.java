// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.ZonedDateTime;

public class GitLabSI implements SoftwareInfo {
	public String projectPath;
	public String apiUri;

	/**
	 * A GitLab scraper for API version 4.
	 *
	 * @param gitLabApiUrl The API Url without version, e.g. https://<gitlab_instance_url>/api
	 * @param projectPath The full path to the project
	 */
	public GitLabSI(String gitLabApiUrl, String projectPath) {
		this.projectPath = projectPath;
		this.apiUri = gitLabApiUrl + "/v4";
	}

	/**
	 * Returns the languages used in a project with percentage values. Uses the API Endpoint
	 * https://docs.gitlab.com/ee/api/projects.html#languages GET /projects/:id/languages
	 *
	 * @return A JSON as a String
	 */
	@Override
	public String languages() {
		return Utils.get(apiUri + "/projects/" + Utils.urlEncode(projectPath) + "/languages");
	}

	/**
	 * Returns the license of a project. If GitLab detects the license, an SPDX identifier will be
	 * returned. If the license could not be detected, returns "Other". API endpoint:
	 * https://docs.gitlab.com/ee/api/projects.html#get-single-project NOTE: A GraphQL request here
	 * might be more efficient since less data would be sent.
	 *
	 * @return The license
	 */
	@Override
	public String license() {
		String repoInfo =
				Utils.get(apiUri + "/projects/" + Utils.urlEncode(projectPath) + "?license=True");
		JsonElement jsonLicense = JsonParser.parseString(repoInfo).getAsJsonObject().get("license");
		return jsonLicense.isJsonNull() ? null
				: jsonLicense.getAsJsonObject().get("name").getAsString();
	}

	/**
	 * Retrieve all contributions from GitLab API. Uses the API Endpoint:
	 * https://docs.gitlab.com/ee/api/commits.html#list-repository-commits
	 * This endpoint does not require authentication for public projects.
	 *
	 * Maybe use GraphQL to reduce return data?
	 * https://docs.gitlab.com/ee/api/graphql/reference/#commit=
	 *
	 * @return String representing a JSON array with the defined metadata (id, committed_date).
	 *
	 * Example URL: https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab-shell/repository/commits?per_page=100&order=default&page=1
	 */
	@Override
	public CommitsPerWeek contributions() {
		CommitsPerWeek commits = new CommitsPerWeek();
		String page = "1";
		boolean done = false;
		while (!done) {
			HttpRequest request = HttpRequest.newBuilder().GET()
					.uri(URI.create(apiUri + "/projects/" + Utils.urlEncode(projectPath)
							+ "/repository/commits?per_page=100&order=default&page=" + page))
					.build();
			HttpClient client =
					HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
			HttpResponse<String> response;
			try {
				response = client.send(request, HttpResponse.BodyHandlers.ofString());
			} catch (IOException | InterruptedException e) {
				System.out.println("An error occurred fetching data from: " + request.uri());
				throw new RuntimeException(e);
			}
			if (response.statusCode() == 429) throw new RsdRateLimitException("API rate limit exceeded for endpoint " + request.uri() + " with response: " + response.body());
			if (response.statusCode() == 404) return null;

			String body = response.body();
			parseCommitPage(body, commits);

			page = response.headers().firstValue("x-next-page").get();
			done = page.length() == 0;
		}
		return commits;
	}

	static void parseCommitPage(String json, CommitsPerWeek commitsToFill) {
		JsonArray thisPageCommits = JsonParser.parseString(json).getAsJsonArray();

		for (JsonElement element : thisPageCommits) {
			JsonObject currentCommit = element.getAsJsonObject();
			String timeString = currentCommit.getAsJsonPrimitive("committed_date").getAsString();
			ZonedDateTime time = ZonedDateTime.parse(timeString);

			commitsToFill.addCommits(time, 1);
		}
	}

}
