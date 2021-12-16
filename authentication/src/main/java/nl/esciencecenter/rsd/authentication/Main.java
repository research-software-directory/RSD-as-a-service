package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
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
			System.out.println(System.currentTimeMillis());
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
			String codeToTokenResponse = post(URI.create("https://connect.test.surfconext.nl/oidc/token"), joinFormEntries(form));
			System.out.println(codeToTokenResponse);
			ctx.result("Succes!");
		});

		app.get("/login/surfconext", ctx -> {
			ctx.html("<a href=\"https://connect.test.surfconext.nl/oidc/authorize?scope=openid&&response_type=code&redirect_uri=http://localhost:7000/login/surfconext&state=example&nonce=example&response_mode=form_post&client_id=" + CONFIG.getProperty("AUTH_SURFCONEXT_CLIENT_ID") + "\">Login with surfconext</a>");
		});

		app.exception(JWTVerificationException.class, (ex, ctx) -> {
			ex.printStackTrace();
			ctx.result("Invalid JWT!");
		});
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}

	public static String post(URI uri, String json) {
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


	public static String joinFormEntries(Map<String, String> form) {
		StringJoiner x_www_form_urlencoded = new StringJoiner("&");
		form.keySet().forEach(key -> {
			x_www_form_urlencoded.add(key + "=" + form.get(key));
		});
		return x_www_form_urlencoded.toString();
	}
}
