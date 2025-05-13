// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

public class PostgrestAccount implements Account {

	private static final String AUTHORIZATION_HEADER_KEY = "Authorization";
	private static final String BEARER_HEADER_VALUE_PREFIX = "bearer";
	private static final String PREFER_HEADER_KEY = "Prefer";

	private final String backendUri;

	public PostgrestAccount(String backendUri) {
		this.backendUri = backendUri;
	}

	public Optional<AccountInfo> getAccountIfExists(OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException {
		Objects.requireNonNull(openIdInfo);
		Objects.requireNonNull(provider);

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
				accountInfo.getAsJsonObject("account")
					.getAsJsonObject("admin_account")
					.get("account_id")
					.isJsonPrimitive()
				&&
				accountInfo.getAsJsonObject("account")
					.getAsJsonObject("admin_account")
					.getAsJsonPrimitive("account_id")
					.getAsString()
					.equals(account.toString());

			if (createAdminIfDevAndNoAdminsExist(backendUri, token, account)) {
				isAdmin = true;
			}

			return Optional.of(new AccountInfo(account, name, isAdmin, openIdInfo.data()));
		}

		return Optional.empty();
	}

	@Override
	public AccountInfo account(OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException {
		Optional<AccountInfo> maybeExistingAccount = getAccountIfExists(openIdInfo, provider);

		if (maybeExistingAccount.isPresent()) {
			return maybeExistingAccount.get();
		}
		// The login credentials do no exist yet, create a new account and return it.
		else {
			// create account
			JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
			String token = jwtCreator.createAdminJwt();
			URI createAccountEndpoint = URI.create(backendUri + "/account");
			String newAccountJson = postJsonAsAdmin(createAccountEndpoint, "{}", token);
			String newAccountId = JsonParser.parseString(newAccountJson)
				.getAsJsonArray()
				.get(0)
				.getAsJsonObject()
				.getAsJsonPrimitive("id")
				.getAsString();

			UUID accountId = UUID.fromString(newAccountId);
			createLoginForAccount(accountId, openIdInfo, provider, backendUri, token);

			boolean isAdmin = createAdminIfDevAndNoAdminsExist(backendUri, token, accountId);

			return new AccountInfo(accountId, openIdInfo.name(), isAdmin, openIdInfo.data());
		}
	}

	public AccountInfo useInviteToCreateAccount(UUID inviteId, OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException, RsdAccountInviteException {
		Objects.requireNonNull(inviteId);
		URI accountInviteUrl = URI.create(backendUri + "/account_invite?select=uses_left,expires_at&id=eq.%s".formatted(inviteId));
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();

		String response = getAsAdmin(accountInviteUrl, token);

		Integer usesLeft = checkInviteResponseGetUsesLeft(inviteId, response);

		// invite is valid
		// decrease uses if finite
		if (usesLeft != null) {
			int usesDecreased = usesLeft - 1;
			String patchInviteJson = "{\"uses_left\": %d}".formatted(usesDecreased);
			URI accountInvitePatchUrl = URI.create(backendUri + "/account_invite?id=eq." + inviteId);
			patchJsonAsAdmin(accountInvitePatchUrl, patchInviteJson, token);
		}

		return account(openIdInfo, provider);
	}

	static Integer checkInviteResponseGetUsesLeft(UUID inviteId, String json) throws RsdAccountInviteException {
		// check if invite exists and is valid
		JsonArray jsonArray = JsonParser.parseString(json).getAsJsonArray();
		if (jsonArray.isEmpty()) {
			throw new RsdAccountInviteException("No invite with ID %s found".formatted(inviteId));
		}

		JsonObject inviteObject = jsonArray.get(0).getAsJsonObject();

		ZonedDateTime expiresAt = ZonedDateTime.parse(inviteObject.getAsJsonPrimitive("expires_at").getAsString());
		if (expiresAt.isBefore(ZonedDateTime.now())) {
			throw new RsdAccountInviteException("The invite with ID %s is expired".formatted(inviteId));
		}

		JsonElement usesLeft = inviteObject.get("uses_left");
		if (usesLeft.isJsonPrimitive() && usesLeft.getAsInt() <= 0) {
			throw new RsdAccountInviteException("The invite with ID %s has been used up".formatted(inviteId));
		}

		return usesLeft.isJsonPrimitive() ? usesLeft.getAsInt() : null;
	}

	public boolean isAdmin(UUID accountId) throws IOException, InterruptedException {
		Objects.requireNonNull(accountId);
		URI accountUrl = URI.create(backendUri + "/admin_account?account_id=eq.%s".formatted(accountId));
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();

		String response = getAsAdmin(accountUrl, token);
		return parseIsAdminResponse(accountId, response);
	}

	static boolean parseIsAdminResponse(UUID accountId, String response) {
		Objects.requireNonNull(accountId);
		Objects.requireNonNull(response);
		JsonElement jsonTree = JsonParser.parseString(response);
		return jsonTree.isJsonArray()
			&& jsonTree.getAsJsonArray().size() == 1
			&& jsonTree.getAsJsonArray().get(0).getAsJsonObject().get("account_id").isJsonPrimitive()
			&& jsonTree.getAsJsonArray()
			.get(0)
			.getAsJsonObject()
			.getAsJsonPrimitive("account_id")
			.getAsString()
			.equals(accountId.toString());
	}

	public void coupleLogin(UUID accountId, OpenIdInfo openIdInfo, OpenidProvider provider) throws IOException, InterruptedException {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String adminJwt = jwtCreator.createAdminJwt();
		createLoginForAccount(accountId, openIdInfo, provider, backendUri, adminJwt);
	}

	private boolean createAdminIfDevAndNoAdminsExist(String backendUri, String token, UUID accountId) throws IOException, InterruptedException {
		if (!Config.isDevEnv()) {
			return false;
		}

		URI adminAccountUri = URI.create(backendUri + "/admin_account");
		HttpResponse<Void> countAdminResponse = headAsAdmin(adminAccountUri, token, PREFER_HEADER_KEY, "count=exact");

		String contentRange = countAdminResponse.headers().firstValue("Content-Range").orElseThrow();
		if (!"0".equals(contentRange.split("/")[1])) {
			return false;
		}

		String body = "{\"account_id\": \"%s\"}".formatted(accountId);
		postJsonAsAdmin(adminAccountUri, body, token);

		return true;
	}

	private void createLoginForAccount(UUID accountId, OpenIdInfo openIdInfo, OpenidProvider provider, String backendUri, String adminJwt) throws IOException, InterruptedException {
		JsonObject loginForAccountData = new JsonObject();
		loginForAccountData.addProperty("account", accountId.toString());
		loginForAccountData.addProperty("sub", openIdInfo.sub());
		loginForAccountData.addProperty("name", openIdInfo.name());
		loginForAccountData.addProperty("email", openIdInfo.email());
		loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
		loginForAccountData.addProperty("provider", provider.toString());
		loginForAccountData.addProperty("last_login_date", ZonedDateTime.now()
			.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		URI createLoginUri = URI.create(backendUri + "/login_for_account");

		HttpResponse<String> response = postJsonAsAdminWithResponse(createLoginUri, loginForAccountData.toString(), adminJwt);
		if (response.statusCode() == 409) {
			throw new RsdAuthenticationException("This login is already coupled to an account.");
		} else if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: %s with status code %d and response: %s".formatted(createLoginUri.toString(), response.statusCode(), response.body()));
		}
	}

	private void updateLoginForAccount(UUID id, OpenIdInfo openIdInfo, String authToken) throws IOException, InterruptedException {
		JsonObject loginForAccountData = new JsonObject();
		loginForAccountData.addProperty("name", openIdInfo.name());
		loginForAccountData.addProperty("email", openIdInfo.email());
		loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
		loginForAccountData.addProperty("last_login_date", ZonedDateTime.now()
			.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		String resultingJson = loginForAccountData.toString();

		URI patchLoginForAccountUri = URI.create(backendUri + "/login_for_account?id=eq." + id.toString());

		patchJsonAsAdmin(patchLoginForAccountUri, resultingJson, authToken);
	}

	static String getAsAdmin(URI uri, String token) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
			.GET()
			.uri(uri)
			.header(AUTHORIZATION_HEADER_KEY, BEARER_HEADER_VALUE_PREFIX + " " + token)
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
			.header(PREFER_HEADER_KEY, "return=representation")
			.header(AUTHORIZATION_HEADER_KEY, BEARER_HEADER_VALUE_PREFIX + " " + token);
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			return client.send(request, HttpResponse.BodyHandlers.ofString());
		}
	}

	private String patchJsonAsAdmin(URI uri, String json, String authToken) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder()
			.method("PATCH", HttpRequest.BodyPublishers.ofString(json))
			.uri(uri)
			.header("Content-Type", "application/json")
			.header(PREFER_HEADER_KEY, "return=representation")
			.header(AUTHORIZATION_HEADER_KEY, BEARER_HEADER_VALUE_PREFIX + " " + authToken)
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

	private HttpResponse<Void> headAsAdmin(URI uri, String token, String... headers) throws IOException, InterruptedException {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
			.HEAD()
			.uri(uri)
			.header(AUTHORIZATION_HEADER_KEY, BEARER_HEADER_VALUE_PREFIX + " " + token);
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			return client.send(request, HttpResponse.BodyHandlers.discarding());
		}
	}
}
