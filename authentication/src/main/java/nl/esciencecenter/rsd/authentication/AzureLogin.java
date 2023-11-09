// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.StringJoiner;

// This authentication provider was developed to work with the Imperial College Azure
// tenant. In principle it should be generic enough to work with a registered
// application from any Azure Active Directory tenant however this has not been tested
// and changes may be needed to further generalise it.

public class AzureLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public AzureLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() throws IOException, InterruptedException {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromAzureconext(form);
		String idToken = extractIdToken(tokenResponse);
		DecodedJWT idJwt = JWT.decode(idToken);
		String subject = idJwt.getSubject();
		String email = idJwt.getClaim("email").asString();
		String name = idJwt.getClaim("name").asString();
		return new OpenIdInfo(subject, name, email, Config.azureOrganisation());
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("scope", "openid");
		form.put("client_id", Config.azureClientId());
		form.put("client_secret", Config.azureClientSecret());
		return form;
	}

	private String getTokensFromAzureconext(Map<String, String> form) throws IOException, InterruptedException {
		String body = formMapToxWwwFormUrlencoded(form);
		URI tokenEndpoint = Utils.getTokenUrlFromWellKnownUrl(URI.create(Config.azureWellknown()));
		return postForm(tokenEndpoint, body);
	}

	private String formMapToxWwwFormUrlencoded(Map<String, String> form) {
		StringJoiner x_www_form_urlencoded = new StringJoiner("&");
		form.keySet().forEach(key -> x_www_form_urlencoded.add(key + "=" + form.get(key)));
		return x_www_form_urlencoded.toString();
	}

	private String extractIdToken(String response) {
		return JsonParser.parseString(response).getAsJsonObject().getAsJsonPrimitive("id_token").getAsString();
	}

	private String postForm(URI uri, String json) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/x-www-form-urlencoded")
				.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 300) {
				throw new RuntimeException("Error fetching data from " + uri.toString() + ": " + response.body());
			}
			return response.body();
		}
	}
}
