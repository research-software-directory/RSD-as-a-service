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
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/languages"));
	}

	@Override
	public String license() {
		String repoData = Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo));
		JsonElement jsonLicense = JsonParser.parseString(repoData).getAsJsonObject().get("license");
		return jsonLicense.isJsonNull() ? null : jsonLicense.getAsJsonObject().getAsJsonPrimitive("spdx_id").getAsString();
	}

	@Override
	public String contributions() {
		return Config.apiCredentialsGithub()
				.map(apiCredentials -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors", "Authorization", "Basic " + Utils.base64Encode(apiCredentials)))
				.orElseGet(() -> Utils.get(baseApiUrl + "/repos/" + repo + "/stats/contributors"));
	}
}
