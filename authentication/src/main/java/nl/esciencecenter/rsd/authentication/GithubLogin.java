// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import nl.esciencecenter.rsd.authentication.accesstoken.RsdParseException;

public class GithubLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public GithubLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() throws IOException, InterruptedException, RsdResponseException {
		Map<String, String> form = createForm();
		String accessToken = getTokensFromGithub(form);

		return getUserInfoFromGithub(accessToken);
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("client_id", Config.githubClientId());
		form.put("client_secret", Config.githubClientSecret());
		return form;
	}

	private static String getTokensFromGithub(Map<String, String> form)
		throws IOException, InterruptedException, RsdResponseException {
		// GitHub's well-known endpoint doesn't return this info,
		// so we have to hardcode it and hope it doesn't change.
		// URL obtained from https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app#accepting-user-authorization
		URI tokenEndpoint = URI.create("https://github.com/login/oauth/access_token");
		HttpResponse<String> response = Utils.postFormReturnResponse(tokenEndpoint, form);

		String body = response.body();
		if (response.statusCode() != 200) {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				body,
				"Wrong status code when obtaining access token from GitHub"
			);
		}

		try {
			return extractAccessToken(body);
		} catch (RsdParseException e) {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				body,
				"Could not parse access token from GitHub"
			);
		}
	}

	static String extractAccessToken(String body) throws RsdParseException {
		for (String keyValuePair : body.split("&")) {
			String[] split = keyValuePair.split("=");
			if (split.length != 2) {
				continue;
			}

			if ("access_token".equals(split[0])) {
				return split[1];
			}
		}

		throw new RsdParseException("Could not parse access token from GitHub");
	}

	private static OpenIdInfo getUserInfoFromGithub(String accessToken)
		throws IOException, InterruptedException, RsdResponseException {
		HttpResponse<String> response;
		try (HttpClient httpClient = HttpClient.newHttpClient()) {
			HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.github.com/user"))
				.header("Authorization", "bearer " + accessToken)
				.build();

			response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

			if (response.statusCode() != 200) {
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Wrong status code when obtaining access token from GitHub"
				);
			}
		}

		try {
			return extractUserInfo(response.body());
		} catch (RsdParseException e) {
			throw new RsdResponseException(
				response.statusCode(),
				response.uri(),
				response.body(),
				"Couldn't parse user info from GitHub"
			);
		}
	}

	static OpenIdInfo extractUserInfo(String body) throws RsdParseException {
		try {
			JsonObject root = JsonParser.parseString(body).getAsJsonObject();

			String sub = root.getAsJsonPrimitive("id").getAsString();

			String name = null;
			String nameKey = "name";
			if (root.has(nameKey) && root.get(nameKey).isJsonPrimitive()) {
				name = root.get(nameKey).getAsJsonPrimitive().getAsString();
			}

			String email = null;
			String emailKey = "email";
			if (root.has(emailKey) && root.get(emailKey).isJsonPrimitive()) {
				email = root.get(emailKey).getAsJsonPrimitive().getAsString();
			}

			String organisation = null;
			String companyKey = "company";
			if (root.has(companyKey) && root.get(companyKey).isJsonPrimitive()) {
				organisation = root.get(companyKey).getAsJsonPrimitive().getAsString();
			}

			return new OpenIdInfo(sub, name, email, organisation, Collections.emptyMap());
		} catch (RuntimeException e) {
			throw new RsdParseException("Couldn't parse user info from GitHub", e);
		}
	}
}
