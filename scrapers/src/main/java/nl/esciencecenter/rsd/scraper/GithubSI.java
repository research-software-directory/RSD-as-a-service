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

	@Override
	public String languages() {
		Objects.requireNonNull(repo);
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages"));
	}

	@Override
	public String license() {
		Objects.requireNonNull(repo);
		String repoData = Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo));
		JsonElement jsonLicense = JsonParser.parseString(repoData).getAsJsonObject().get("license");
		return jsonLicense.isJsonNull() ? null : jsonLicense.getAsJsonObject().getAsJsonPrimitive("spdx_id").getAsString();
	}
}
