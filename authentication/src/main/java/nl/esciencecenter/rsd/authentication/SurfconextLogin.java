package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

public class SurfconextLogin implements Login {

	private final String CODE;
	private final String REDIRECT_URL;

	public SurfconextLogin(String code, String redirectUrl) {
		if (code == null) throw new IllegalArgumentException("The code should not be null");
		if (redirectUrl == null) throw new IllegalArgumentException("The redirect url should not be null");
		this.CODE = code;
		this.REDIRECT_URL = redirectUrl;
	}


	@Override
	public String account() {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromSurfconext(form);
		String idToken = extractIdToken(tokenResponse);
		String account = accountFromIdToken(idToken);
		return account;
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", CODE);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", REDIRECT_URL);
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

	private String accountFromIdToken(String idToken) {
		DecodedJWT idJwt = JWT.decode(idToken);
		String subject = idJwt.getSubject();
		return accountFromSubject(subject);
	}

	private String accountFromSubject(String subject) {
		String backendUri = Config.backendBaseUrl();
		URI queryUri = URI.create(backendUri + "/login_for_account?select=account,sub&sub=eq." + subject);
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();
		String responseLogin = getAsAdmin(queryUri, token);
		JsonArray accountsWithSub = JsonParser.parseString(responseLogin).getAsJsonArray();
		if (accountsWithSub.size() > 1)
			throw new RuntimeException("More than one login for subject " + subject + " exists");
		else if (accountsWithSub.size() == 1)
			return accountsWithSub.get(0).getAsJsonObject().getAsJsonPrimitive("account").getAsString();
		else { // create account
			URI createAccountEndpoint = URI.create(backendUri + "/account");
			String newAccountId = JsonParser.parseString(postJsonAsAdmin(createAccountEndpoint, "{}", token)).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString();

//			create login for account
			JsonObject loginForAccountData = new JsonObject();
			loginForAccountData.addProperty("account", newAccountId);
			loginForAccountData.addProperty("sub", subject);
			URI createLoginUri = URI.create(backendUri + "/login_for_account");
			postJsonAsAdmin(createLoginUri, loginForAccountData.toString(), token);

			return newAccountId;
		}
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

	private String postJsonAsAdmin(URI uri, String json, String token) {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
				.header("Authorization", "bearer " + token)
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: " + response.body());
		}
		return response.body();
	}


	private String getAsAdmin(URI uri, String token) {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(uri)
				.header("Authorization", "bearer " + token)
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: " + response.body());
		}
		return response.body();
	}
}
