package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonParser;

import java.util.Objects;

public class GithubSI implements SoftwareInfo {

	private final String baseApiUrl;

	public GithubSI(String baseApiUrl) {
		this.baseApiUrl = Objects.requireNonNull(baseApiUrl);
	}

	@Override
	public String data(String repo) {
		Objects.requireNonNull(repo);
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages"));
	}

	@Override
	public String license(String repo) {
		Objects.requireNonNull(repo);
		String repoData = Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo));
		return JsonParser.parseString(repoData).getAsJsonObject().getAsJsonObject("license").getAsJsonPrimitive("spdx_id").getAsString();
	}
}
