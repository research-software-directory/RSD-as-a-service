// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Utils {

	private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);
	private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);
	private static final Set<String> FORBIDDEN_HEADERS = Set.of(
		"host",
		"content-length",
		"transfer-encoding",
		"connection",
		"upgrade",
		"te",
		"expect",
		":method",
		":path",
		":scheme",
		":authority"
	);

	private Utils() {}

	@SafeVarargs
	public static <T> T coalesce(T... objects) {
		for (T object : objects) {
			if (object != null) {
				return object;
			}
		}
		throw new NullPointerException("No non-null reference found");
	}

	public static URI getAuthUrlFromWellKnownUrl(URI wellKnownUrl)
		throws IOException, InterruptedException, RsdResponseException {
		HttpRequest request = HttpRequest.newBuilder(wellKnownUrl).build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(
				request,
				HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
			);

			if (response.statusCode() != 200) {
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Wrong status code querying well-known URL"
				);
			}
			try {
				return extractAuthUrlFromWellKnownData(response.body());
			} catch (RuntimeException e) {
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Could not extract auth URL from well-known URL response body"
				);
			}
		}
	}

	public static URI getTokenUrlFromWellKnownUrl(URI wellKnownUrl) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder(wellKnownUrl).build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(
				request,
				HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
			);
			return extractTokenUrlFromWellKnownData(response.body());
		}
	}

	public static URI extractAuthUrlFromWellKnownData(String jsonData) {
		JsonObject dataAsObject = JsonParser.parseString(jsonData).getAsJsonObject();
		String tokenUrl = dataAsObject.getAsJsonPrimitive("authorization_endpoint").getAsString();
		return URI.create(tokenUrl);
	}

	public static URI extractTokenUrlFromWellKnownData(String jsonData) {
		JsonObject dataAsObject = JsonParser.parseString(jsonData).getAsJsonObject();
		String tokenUrl = dataAsObject.getAsJsonPrimitive("token_endpoint").getAsString();
		return URI.create(tokenUrl);
	}

	public static String urlEncode(String s) {
		return URLEncoder.encode(s, StandardCharsets.UTF_8);
	}

	public static String formMapToxWwwFormUrlencoded(Map<String, String> form) {
		StringJoiner x_www_form_urlencoded = new StringJoiner("&");
		form.forEach((key, value) -> x_www_form_urlencoded.add(urlEncode(key) + "=" + urlEncode(value)));
		return x_www_form_urlencoded.toString();
	}

	public static HttpRequest formToHttpRequest(URI uri, Map<String, String> form) {
		String body = formMapToxWwwFormUrlencoded(form);

		return HttpRequest.newBuilder()
			.POST(HttpRequest.BodyPublishers.ofString(body))
			.uri(uri)
			.header("Content-Type", "application/x-www-form-urlencoded")
			.build();
	}

	public static String postForm(URI uri, Map<String, String> form)
		throws IOException, InterruptedException, RsdResponseException {
		HttpRequest request = formToHttpRequest(uri, form);
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 300) {
				LOGGER.error("Error posting form: {}, {}", response.statusCode(), response.body());
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Error posting form"
				);
			}
			return response.body();
		}
	}

	/**
	 * Retrieve data from PostgREST as an admin user and retrieve the response body.
	 *
	 * @param uri The URI
	 * @return the content of the HTTP response
	 */
	public static String getAsAdmin(String uri) throws IOException, InterruptedException, RsdResponseException {
		String signingSecret = Config.jwtSigningSecret();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);
		String jwtString = jwtCreator.createAdminJwt();

		HttpRequest request = HttpRequest.newBuilder()
			.GET()
			.uri(URI.create(uri))
			.timeout(DEFAULT_TIMEOUT)
			.header("Authorization", "Bearer " + jwtString)
			.build();

		HttpResponse<String> response;

		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());

			if (response.statusCode() >= 300) {
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Error with GET as admin"
				);
			}

			return response.body();
		}
	}

	public static boolean isForbiddenHeader(String headerName) {
		if (headerName == null) return true;
		return FORBIDDEN_HEADERS.contains(headerName.toLowerCase()) || headerName.startsWith(":");
	}
}
