// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonElement;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

public class Utils {

	public static String base64Encode(String s) {
		return Base64.getEncoder().encodeToString(s.getBytes());
	}

	/**
	 * Urlencode a string.
	 *
	 * @param value The string to be encoded
	 * @return The urlencoded string.
	 */
	public static String urlEncode(String value) {
		return URLEncoder.encode(value, StandardCharsets.UTF_8);
	}

	/**
	 * Performs a GET request with given headers and returns the response body
	 * as a String.
	 *
	 * @param uri     The encoded URI
	 * @param headers (Optional) Variable amount of headers. Number of arguments must be a multiple of two.
	 * @return The response as a String.
	 */
	public static String get(String uri, String... headers) {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(uri));
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();
		HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RsdResponseException(response.statusCode(), "Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	public static HttpResponse<String> getAsHttpResponse(String uri, String... headers) {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(uri));
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();
		HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
			return response;
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * Retrieve data from PostgREST as an admin user and retrieve the response body.
	 *
	 * @param uri The URI
	 * @return Returns the content of the HTTP response
	 */
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
			System.out.println("An error occurred sending a request to " + uri + ":");
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	/**
	 * Performs a POST request with given headers and returns the response body
	 * as a String.
	 *
	 * @param uri          The URI
	 * @param body         the request body as a string
	 * @param extraHeaders Additional headers (amount must be multiple of two)
	 * @return The response body as a string
	 */
	public static String post(String uri, String body, String... extraHeaders) {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(body))
				.uri(URI.create(uri));
		if (extraHeaders != null && extraHeaders.length > 0 && extraHeaders.length % 2 == 0) {
			httpRequestBuilder.headers(extraHeaders);
		}
		HttpRequest request = httpRequestBuilder.build();
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

	/**
	 * Post data to the database.
	 *
	 * @param uri          The URI
	 * @param json         JSON as a string containing the values
	 * @param extraHeaders Additional headers (amount must be multiple of two)
	 * @return ???
	 */
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

	public static String patchAsAdmin(String uri, String json) {
		String jwtString = adminJwt();
		HttpRequest request = HttpRequest.newBuilder()
				.method("PATCH", HttpRequest.BodyPublishers.ofString(json))
				.uri(URI.create(uri))
				.header("Content-Type", "application/json")
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

	private static String adminJwt() {
		String signingSecret = Config.jwtSigningSecret();
		Algorithm signingAlgorithm = Algorithm.HMAC256(signingSecret);
		String jwtString = JWT.create()
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + Config.jwtExpirationTime()))
				.sign(signingAlgorithm);
		return jwtString;
	}

	public static String stringOrNull(JsonElement e) {
		return e == null || !e.isJsonPrimitive() ? null : e.getAsString();
	}

	public static Integer integerOrNull(JsonElement e) {
		return e == null || !e.isJsonPrimitive() ? null : e.getAsInt();
	}
}
