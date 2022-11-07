// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
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

public class OrcidLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public OrcidLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromOrcidconext(form);
		String idToken = extractIdToken(tokenResponse);

		DecodedJWT idJwt = JWT.decode(idToken);
		String subject = idJwt.getSubject();
		String name = idJwt.getClaim("name").asString();
		if (name == null) {
			String givenName = idJwt.getClaim("given_name").asString();
			String familyName = idJwt.getClaim("family_name").asString();
			if (givenName != null && familyName != null) name = givenName + " " + familyName;
			else if (familyName != null) name = familyName;
			else if (givenName != null ) name = givenName;
		}
		return new OpenIdInfo(subject, name, null, null);
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("scope", "openid");
		form.put("client_id", Config.orcidClientId());
		form.put("client_secret", Config.orcidClientSecret());
		return form;
	}

	private String getTokensFromOrcidconext(Map<String, String> form) {
		String body = formMapToxWwwFormUrlencoded(form);
		URI tokenEndpoint = Utils.getTokenUrlFromWellKnownUrl(URI.create(Config.orcidWellknown()));
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

	private String postForm(URI uri, String json) {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/x-www-form-urlencoded")
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from " + uri.toString() + ": " + response.body());
		}
		return response.body();
	}
}
