package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.javalin.Javalin;

import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.StringJoiner;

public class Main {

	static final String JWT_SECRET = "someSecret";
	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60* 60* 1000
	static final Properties CONFIG = new Properties();

	public static void main(String[] args) throws IOException {
		CONFIG.load(new FileReader(args[0]));
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.result("Hello World!"));

		app.get("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(JWT_SECRET);
			String token = JWT.create()
					.withClaim("role", "authenticated")
					.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
					.sign(signingAlgorithm);
			ctx.result(token);
		});

		app.post("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(JWT_SECRET);
			String token = ctx.body();
			JWTVerifier verifier = JWT.require(signingAlgorithm).build();
			DecodedJWT decodedJWT = verifier.verify(token);
			ctx.result(decode(decodedJWT.getHeader()) + "\n" + decode(decodedJWT.getPayload()));
		});

		app.post("/login/surfconext", ctx -> {
			System.out.println(ctx.formParamMap());
			String code = ctx.formParam("code");
			Map<String, String> form = new HashMap<>();
			form.put("code", code);
			form.put("grant_type", "authorization_code");
			form.put("redirect_uri", "http://localhost:7000/login/surfconext");
			form.put("scope", "openid");
			form.put("client_id", CONFIG.getProperty("AUTH_SURFCONEXT_CLIENT_ID"));
			form.put("client_secret", CONFIG.getProperty("AUTH_SURFCONEXT_CLIENT_SECRET"));

			String codeToTokenResponse = postForm(URI.create("https://connect.test.surfconext.nl/oidc/token"), joinFormEntries(form));
			System.out.println(codeToTokenResponse);

			String idToken = JsonParser.parseString(codeToTokenResponse).getAsJsonObject().getAsJsonPrimitive("id_token").getAsString();
			DecodedJWT idJwt = JWT.decode(idToken);
			String subject = idJwt.getSubject();
			createAccountIfNotExists(subject);
			String account = accountFromSubject(subject);
			Algorithm signingAlgorithm = Algorithm.HMAC256(JWT_SECRET);
			String token = JWT.create()
					.withClaim("role", "authenticated")
					.withClaim("account", account)
					.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
					.sign(signingAlgorithm);
			ctx.result(token);
		});

		app.get("/login/surfconext", ctx -> {
			ctx.html("<a href=\"https://connect.test.surfconext.nl/oidc/authorize?scope=openid&&response_type=code&redirect_uri=http://localhost:7000/login/surfconext&state=example&nonce=example&response_mode=form_post&client_id=" + CONFIG.getProperty("AUTH_SURFCONEXT_CLIENT_ID") + "\">Login with surfconext</a>");
		});

		app.exception(JWTVerificationException.class, (ex, ctx) -> {
			ex.printStackTrace();
			ctx.result("Invalid JWT!");
		});
	}

	static void createAccountIfNotExists(String sub) {
		String backendUri = CONFIG.getProperty("POSTGREST_URL");
		URI queryUri = URI.create(backendUri + "/login_for_account?select=sub&sub=eq." + sub);
		String responseLogin = get(queryUri);
		JsonArray accountsWIthSub = JsonParser.parseString(responseLogin).getAsJsonArray();
		if (accountsWIthSub.size() > 1) throw new RuntimeException("More than one login for sub " + sub + " exists");
		else if (accountsWIthSub.size() == 0) {
			URI createAccountUri = URI.create(backendUri + "/account");
			String newAccountId = JsonParser.parseString(postJson(createAccountUri, "{}")).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("id").getAsString();

			JsonObject loginForAccountData = new JsonObject();
			loginForAccountData.addProperty("account", newAccountId);
			loginForAccountData.addProperty("sub", sub);
			URI createLoginUri = URI.create(backendUri + "/login_for_account");
			postJson(createLoginUri, loginForAccountData.toString());
		}
	}

	static String accountFromSubject(String sub) {
		String backendUri = CONFIG.getProperty("POSTGREST_URL");
		URI queryUri = URI.create(backendUri + "/login_for_account?select=account&sub=eq." + sub);
		String responseAccount = get(queryUri);
		return JsonParser.parseString(responseAccount).getAsJsonArray().get(0).getAsJsonObject().getAsJsonPrimitive("account").getAsString();
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}

	public static String get(URI uri) {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(uri)
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

	public static String postForm(URI uri, String json) {
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
			throw new RuntimeException("Error fetching data from the endpoint: " + response.body());
		}
		return response.body();
	}

	public static String postJson(URI uri, String json) {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
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


	public static String joinFormEntries(Map<String, String> form) {
		StringJoiner x_www_form_urlencoded = new StringJoiner("&");
		form.keySet().forEach(key -> {
			x_www_form_urlencoded.add(key + "=" + form.get(key));
		});
		return x_www_form_urlencoded.toString();
	}
}
