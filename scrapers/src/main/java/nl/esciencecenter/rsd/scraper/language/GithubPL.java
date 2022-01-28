package nl.esciencecenter.rsd.scraper.language;

import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.util.Objects;

public class GithubPL implements ProgrammingLanguages {

	private final String baseApiUrl;

	public GithubPL(String baseApiUrl) {
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
