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
		URI queryUri = URI.create(backendUri + "/login_for_account?select=id,account,name&sub=eq." + subjectUrlEncoded + "&provider=eq." + providerUrlEncoded);
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();
		String responseLogin = getAsAdmin(queryUri, token);
		JsonArray accountsWithSub = JsonParser.parseString(responseLogin).getAsJsonArray();
		if (accountsWithSub.size() > 1)
			throw new RuntimeException("More than one login for subject " + subject + " exists");
		else if (accountsWithSub.size() == 1) {
			JsonObject accountInfo = accountsWithSub.get(0).getAsJsonObject();
			UUID id = UUID.fromString(accountInfo.getAsJsonPrimitive("id").getAsString());
			updateLoginForAccount(id, openIdInfo, token);
			UUID account = UUID.fromString(accountInfo.getAsJsonPrimitive("account").getAsString());
			String name = openIdInfo.name();
			return new AccountInfo(account, name);
		} else { // create account
			URI createAccountEndpoint = URI.create(backendUri + "/account");
			String newAccountJson = postJsonAsAdmin(createAccountEndpoint, "{}", token);
			String newAccountId = JsonParser.parseString(newAccountJson).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString();

			// create login for account
			JsonObject loginForAccountData = new JsonObject();
			loginForAccountData.addProperty("account", newAccountId);
			loginForAccountData.addProperty("sub", subject);
			loginForAccountData.addProperty("name", openIdInfo.name());
			loginForAccountData.addProperty("email", openIdInfo.email());
			loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
			loginForAccountData.addProperty("provider", provider.toString());
			URI createLoginUri = URI.create(backendUri + "/login_for_account");
			postJsonAsAdmin(createLoginUri, loginForAccountData.toString(), token);

			return new AccountInfo(UUID.fromString(newAccountId), openIdInfo.name());
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

	private String postJsonAsAdmin(URI uri, String json, String token) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
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
