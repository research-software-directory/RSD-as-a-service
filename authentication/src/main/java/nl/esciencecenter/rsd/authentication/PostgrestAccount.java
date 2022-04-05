package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;
import java.util.UUID;

public class PostgrestAccount implements Account {

	private final OpenIdInfo openIdInfo;

	public PostgrestAccount(OpenIdInfo openIdInfo) {
		this.openIdInfo = Objects.requireNonNull(openIdInfo);
		Objects.requireNonNull(openIdInfo.sub());
	}

	@Override
	public AccountInfo account() {
		String backendUri = Config.backendBaseUrl();
		String subject = openIdInfo.sub().toString();
		URI queryUri = URI.create(backendUri + "/login_for_account?select=account,name&sub=eq." + subject);
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();
		String responseLogin = getAsAdmin(queryUri, token);
		JsonArray accountsWithSub = JsonParser.parseString(responseLogin).getAsJsonArray();
		if (accountsWithSub.size() > 1)
			throw new RuntimeException("More than one login for subject " + subject + " exists");
		else if (accountsWithSub.size() == 1) {
			JsonObject accountInfo = accountsWithSub.get(0).getAsJsonObject();
			UUID account = UUID.fromString(accountInfo.getAsJsonPrimitive("account").getAsString());
			String name = accountInfo.getAsJsonPrimitive("name").getAsString();
			return new AccountInfo(account, name);
		}
		else { // create account
			URI createAccountEndpoint = URI.create(backendUri + "/account");
			String newAccountId = JsonParser.parseString(postJsonAsAdmin(createAccountEndpoint, "{}", token)).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString();

//			create login for account
			JsonObject loginForAccountData = new JsonObject();
			loginForAccountData.addProperty("account", newAccountId);
			loginForAccountData.addProperty("sub", subject);
			loginForAccountData.addProperty("name", openIdInfo.name());
			loginForAccountData.addProperty("email", openIdInfo.email());
			loginForAccountData.addProperty("home_organisation", openIdInfo.organisation());
			URI createLoginUri = URI.create(backendUri + "/login_for_account");
			postJsonAsAdmin(createLoginUri, loginForAccountData.toString(), token);

			return new AccountInfo(UUID.fromString(newAccountId), openIdInfo.name());
		}
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
}
