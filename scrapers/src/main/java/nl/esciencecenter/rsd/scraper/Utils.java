package nl.esciencecenter.rsd.scraper;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.Date;

public class Utils {

	public static String base64Encode(String s) {
		return Base64.getEncoder().encodeToString(s.getBytes());
	}

	public static String get(String uri, String... headers) {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(uri))
				.headers(headers)
				.build();
		HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	public static String getAsAdmin(String uri) {
		String jwtString = adminJwt();
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(uri))
				.header("Authorization", "Bearer " + jwtString)
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	public static String postAsAdmin(String uri, String json, String... extraHeaders) {
		String jwtString = adminJwt();
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(URI.create(uri))
				.header("Content-Type", "application/json")
				.header("Authorization", "Bearer " + jwtString)
				.headers(extraHeaders)
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	private static String adminJwt() {
		String signingSecret = Config.jwtSigningSecret();
		Algorithm signingAlgorithm = Algorithm.HMAC256(signingSecret);
		String jwtString = JWT.create()
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + Config.jwtExpirationTime()))
				.sign(signingAlgorithm);
		return jwtString;
	}
}
