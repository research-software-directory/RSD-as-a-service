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
import java.util.UUID;

public class SurfconextLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public SurfconextLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromSurfconext(form);
		String idToken = extractIdToken(tokenResponse);

		DecodedJWT idJwt = JWT.decode(idToken);
		UUID subject = UUID.fromString(idJwt.getSubject());
		String name = idJwt.getClaim("name").asString();
		String email = idJwt.getClaim("email").asString();
		String organisation = idJwt.getClaim("schac_home_organization").asString();
		return new OpenIdInfo(subject, name, email, organisation);
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("scope", "openid");
		form.put("client_id", Config.surfconextClientId());
		form.put("client_secret", Config.surfconextClientSecret());
		return form;
	}

	private String getTokensFromSurfconext(Map<String, String> form) {
		String body = formMapToxWwwFormUrlencoded(form);
		return postForm(URI.create("https://connect.test.surfconext.nl/oidc/token"), body);
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
