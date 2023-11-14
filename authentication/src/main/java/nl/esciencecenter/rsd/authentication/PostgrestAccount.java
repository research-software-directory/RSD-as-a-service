// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

public class PostgrestAccount implements Account {


	@Override
	public AccountInfo account(OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException {
		Objects.requireNonNull(openIdInfo);
		Objects.requireNonNull(provider);

		String backendUri = Config.backendBaseUrl();
		String subject = openIdInfo.sub();
		String subjectUrlEncoded = URLEncoder.encode(subject, StandardCharsets.UTF_8);
		String providerUrlEncoded = URLEncoder.encode(provider.toString(), StandardCharsets.UTF_8);

		// The following URI sees if the login credentials already are tied to an account.
		// If yes, it also, by joining through the account table, looks up if the account is an admin.
		URI queryUri = URI.create(backendUri + "/login_for_account?select=id,account_id:account,name,account(admin_account(account_id))&sub=eq." + subjectUrlEncoded + "&provider=eq." + providerUrlEncoded);
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();
		String responseLogin = getAsAdmin(queryUri, token);
		JsonArray accountsWithSub = JsonParser.parseString(responseLogin).getAsJsonArray();
		// Because of the UNIQUE(provider, sub) constraint on the login_for_account table, this should never happen
		if (accountsWithSub.size() > 1) {
			throw new RuntimeException("More than one login for subject " + subject + " exists");
		}
		// The credentials are already tied to an account, so we update the login credentials with a possibly new name, email, etc.,
		// and we return the existing account.
		else if (accountsWithSub.size() == 1) {
			JsonObject accountInfo = accountsWithSub.get(0).getAsJsonObject();
			UUID id = UUID.fromString(accountInfo.getAsJsonPrimitive("id").getAsString());
			updateLoginForAccount(id, openIdInfo, token);
			UUID account = UUID.fromString(accountInfo.getAsJsonPrimitive("account_id").getAsString());
			String name = openIdInfo.name();

			boolean isAdmin = accountInfo.getAsJsonObject("account").get("admin_account").isJsonObject()
					&&
					accountInfo.getAsJsonObject("account").getAsJsonObject("admin_account").get("account_id").isJsonPrimitive()
					&&
					accountInfo.getAsJsonObject("account").getAsJsonObject("admin_account").getAsJsonPrimitive("account_id").getAsString().equals(account.toString());

			return new AccountInfo(account, name, isAdmin);
		}
		// The login credentials do no exist yet, create a new account and return it.
		else {
			// create account
			URI createAccountEndpoint = URI.create(backendUri + "/account");
			String newAccountJson = postJsonAsAdmin(createAccountEndpoint, "{}", token);
			String newAccountId = JsonParser.parseString(newAccountJson).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString();

			createLoginForAccount(UUID.fromString(newAccountId), openIdInfo, provider, backendUri, token);

			return new AccountInfo(UUID.fromString(newAccountId), openIdInfo.name(), false);
		}
	}

	public void coupleLogin(UUID accountId, OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException {
		String backendUri = Config.backendBaseUrl();
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String adminJwt = jwtCreator.createAdminJwt();
		createLoginForAccount(accountId, openIdInfo, provider, backendUri, adminJwt);
	}

	private void createLoginForAccount(UUID accountId, OpenIdInfo openIdInfo, OpenidProvider provider, String backendUri, String adminJwt) throws IOException, InterruptedException {
		JsonObject loginForAccountData = new JsonObject();
		loginForAccountData.addProperty("account", accountId.toString());
		loginForAccountData.addProperty("sub", openIdInfo.sub());
		loginForAccountData.addProperty("name", openIdInfo.name());
		loginForAccountData.addProperty("email", openIdInfo.email());
		loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
		loginForAccountData.addProperty("provider", provider.toString());
		URI createLoginUri = URI.create(backendUri + "/login_for_account");

		HttpResponse<String> response = postJsonAsAdminWithResponse(createLoginUri, loginForAccountData.toString(), adminJwt);
		if (response.statusCode() == 409) {
			throw new RsdAuthenticationException("This login is already coupled to an account.");
		} else if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: %s with status code %d and response: %s".formatted(createLoginUri.toString(), response.statusCode(), response.body()));
		}
	}

	private void updateLoginForAccount(UUID id, OpenIdInfo openIdInfo, String token) throws IOException, InterruptedException {
		JsonObject loginForAccountData = new JsonObject();
		loginForAccountData.addProperty("name", openIdInfo.name());
		loginForAccountData.addProperty("email", openIdInfo.email());
		loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
		String resultingJson = loginForAccountData.toString();

		String backendUri = Config.backendBaseUrl();
		URI patchLoginForAccountUri = URI.create(backendUri + "/login_for_account?id=eq." + id.toString());

		patchJsonAsAdmin(patchLoginForAccountUri, resultingJson, token);
	}

	static String getAsAdmin(URI uri, String token) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(uri)
				.header("Authorization", "bearer " + token)
				.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 300) {
				throw new RuntimeException("Error fetching data from the endpoint: " + uri.toString() + " with response: " + response.body());
			}
			return response.body();
		}
	}

	public static String postJsonAsAdmin(URI uri, String json, String token, String... headers) throws IOException, InterruptedException {
		HttpResponse<String> response = postJsonAsAdminWithResponse(uri, json, token, headers);
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: %s with status code %d and response: %s".formatted(uri.toString(), response.statusCode(), response.body()));
		}
		return response.body();
	}

	public static HttpResponse<String> postJsonAsAdminWithResponse(URI uri, String json, String token, String... headers) throws IOException, InterruptedException {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
				.header("Authorization", "bearer " + token);
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			return client.send(request, HttpResponse.BodyHandlers.ofString());
		}
	}

	private String patchJsonAsAdmin(URI uri, String json, String token) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
				.method("PATCH", HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
				.header("Authorization", "bearer " + token)
				.build();
		HttpResponse<String> response;
		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 300) {
				throw new RuntimeException("Error fetching data from the endpoint: " + uri.toString() + " with response: " + response.body());
			}
			return response.body();
		}
	}
}
