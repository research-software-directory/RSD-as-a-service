// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
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
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

public class Utils {

	private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

	// Default timeout used for http connections.
	private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);

	private Utils() {
	}

	/**
	 * Base64encode a string.
	 *
	 * @param s The string to be encoded
	 * @return The base64 encoded string.
	 */
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
	 * Performs a GET request with given headers and returns the response body as a String.
	 *
	 * @param uri     The encoded URI
	 * @param headers (Optional) Variable amount of headers. Number of arguments must be a multiple of two.
	 * @return The response as a String.
	 * @throws IOException
	 * @throws InterruptedException
	 * @throws RsdResponseException
	 */
	public static String get(String uri, String... headers) throws IOException, InterruptedException, RsdResponseException {
		HttpResponse<String> response = getAsHttpResponse(uri, headers);

		if (response.statusCode() >= 300) {
			throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Unexpected response");
		}

		return response.body();
	}

	/**
	 * Performs a GET request with given headers and returns the entire http response.
	 *
	 * @param uri     The encoded URI
	 * @param headers (Optional) Variable amount of headers. Number of arguments must be a multiple of two.
	 * @return The response as a String.
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static HttpResponse<String> getAsHttpResponse(String uri, String... headers) throws IOException, InterruptedException {
		HttpRequest.Builder httpRequestBuilder = HttpRequest.newBuilder()
			.GET()
			.timeout(DEFAULT_TIMEOUT)
			.uri(URI.create(uri));
		if (headers != null && headers.length > 0 && headers.length % 2 == 0) {
			httpRequestBuilder.headers(headers);
		}
		HttpRequest request = httpRequestBuilder.build();

		try (HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build()) {
			return client.send(request, HttpResponse.BodyHandlers.ofString());
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
			.timeout(DEFAULT_TIMEOUT)
			.header("Authorization", "Bearer " + jwtString)
			.build();

		HttpResponse<String> response;

		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (InterruptedException e) {
			LOGGER.warn("Request to {} was interrupted", uri, e);
			Thread.currentThread().interrupt();
			throw new RuntimeException(e);
		} catch (IOException e) {
			LOGGER.error("An error occurred sending a request to {}", uri, e);
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
			.timeout(DEFAULT_TIMEOUT)
			.uri(URI.create(uri));
		if (extraHeaders != null && extraHeaders.length > 0 && extraHeaders.length % 2 == 0) {
			httpRequestBuilder.headers(extraHeaders);
		}
		HttpRequest request = httpRequestBuilder.build();
		HttpResponse<String> response;

		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new RuntimeException(e);
		} catch (IOException e) {
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
		HttpRequest.Builder builder = HttpRequest.newBuilder()
			.POST(HttpRequest.BodyPublishers.ofString(json))
			.uri(URI.create(uri))
			.timeout(DEFAULT_TIMEOUT)
			.header("Content-Type", "application/json")
			.header("Authorization", "Bearer " + jwtString);
		if (extraHeaders != null && extraHeaders.length > 0) {
			builder.headers(extraHeaders);
		}
		HttpRequest request = builder.build();
		HttpResponse<String> response;

		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	private static JsonObject basicData(String serviceName, String tableName, UUID referenceId, Exception e) {
		String message = e.getMessage();
		StringWriter stringWriter = new StringWriter();
		PrintWriter printWriter = new PrintWriter(stringWriter);
		e.printStackTrace(printWriter);
		printWriter.flush();
		String stackTrace = stringWriter.toString();

		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("service_name", serviceName);
		jsonObject.addProperty("table_name", tableName);
		jsonObject.addProperty("reference_id", referenceId != null ? referenceId.toString() : null);
		jsonObject.addProperty("message", message);
		jsonObject.addProperty("stack_trace", stackTrace);

		return jsonObject;
	}

	public static void saveExceptionInDatabase(String serviceName, String tableName, UUID referenceId, Exception e) {
		JsonObject logData = basicData(serviceName, tableName, referenceId, e);

		postAsAdmin(Config.backendBaseUrl() + "/backend_log", logData.toString());
	}

	public static void saveExceptionInDatabase(String serviceName, String tableName, UUID referenceId, RsdResponseException e) {
		JsonObject logData = basicData(serviceName, tableName, referenceId, e);

		JsonObject other = new JsonObject();
		other.addProperty("status_code", e.statusCode);
		other.addProperty("URI", e.uri != null ? e.uri.toString() : null);
		other.addProperty("response_body", e.body);

		logData.add("other_data", other);

		postAsAdmin(Config.backendBaseUrl() + "/backend_log", logData.toString());
	}

	public static void saveExceptionInDatabase(String serviceName, String tableName, UUID referenceId, RsdRateLimitException e) {
		JsonObject logData = basicData(serviceName, tableName, referenceId, e);

		JsonObject other = new JsonObject();
		other.addProperty("status_code", e.statusCode);
		other.addProperty("URI", e.uri != null ? e.uri.toString() : null);
		other.addProperty("response_body", e.body);

		logData.add("other_data", other);

		postAsAdmin(Config.backendBaseUrl() + "/backend_log", logData.toString());
	}

	public static void saveErrorMessageInDatabase(String message, String tableName, String columnName, String primaryKey, String primaryKeyName, ZonedDateTime scrapedAt, String scrapedAtName) {
		JsonObject body = new JsonObject();
		if (columnName != null) {
			body.addProperty(columnName, message);
		}

		if (scrapedAt != null && scrapedAtName != null) {
			body.addProperty(scrapedAtName, scrapedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		}

		String uri = createPatchUri(Config.backendBaseUrl(), tableName, primaryKey, primaryKeyName);

		patchAsAdmin(uri, body.toString());
	}

	static String createPatchUri(String baseuri, String tableName, String primaryKey, String primaryKeyName) {
		return "%s/%s?%s=eq.%s".formatted(baseuri, tableName, primaryKeyName, primaryKey);
	}

	public static String patchAsAdmin(String uri, String json, String... extraHeaders) {
		String jwtString = adminJwt();
		HttpRequest.Builder builder = HttpRequest.newBuilder()
			.method("PATCH", HttpRequest.BodyPublishers.ofString(json))
			.uri(URI.create(uri))
			.timeout(Duration.ofSeconds(30))
			.header("Content-Type", "application/json")
			.header("Authorization", "Bearer " + jwtString);
		if (extraHeaders != null && extraHeaders.length > 0) {
			builder.headers(extraHeaders);
		}
		HttpRequest request = builder.build();
		HttpResponse<String> response;
		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from endpoint " + uri + " with response: " + response.body());
		}
		return response.body();
	}

	public static String deleteAsAdmin(String uri, String... extraHeaders) throws IOException, InterruptedException, RsdResponseException {
		String jwtString = adminJwt();
		HttpRequest.Builder builder = HttpRequest.newBuilder()
			.method("DELETE", HttpRequest.BodyPublishers.noBody())
			.uri(URI.create(uri))
			.timeout(Duration.ofSeconds(30))
			.header("Authorization", "Bearer " + jwtString);
		if (extraHeaders != null && extraHeaders.length > 0) {
			builder.headers(extraHeaders);
		}
		HttpRequest request = builder.build();
		HttpResponse<String> response;
		try (HttpClient client = HttpClient.newHttpClient()) {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		}
		if (response.statusCode() >= 300) {
			throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Error deleting data as admin");
		}
		return response.body();
	}

	private static String adminJwt() {
		String signingSecret = Config.jwtSigningSecret();
		Algorithm signingAlgorithm = Algorithm.HMAC256(signingSecret);
		return JWT.create()
			.withClaim("role", "rsd_admin")
			.withExpiresAt(new Date(System.currentTimeMillis() + Config.jwtExpirationTime()))
			.sign(signingAlgorithm);
	}

	public static String stringOrNull(JsonElement e) {
		return e == null || !e.isJsonPrimitive() ? null : e.getAsString();
	}

	public static <T> T safelyGetOrNull(JsonElement element, Function<JsonElement, T> extractor) {
		try {
			return extractor.apply(element);
		} catch (RuntimeException e) {
			LOGGER.warn("Exception extracting data from JSON: " + element, e);
			return null;
		}
	}

	public static Integer integerOrNull(JsonElement e) {
		return e == null || !e.isJsonPrimitive() ? null : e.getAsInt();
	}

	/**
	 * Generate a filter to select column entries older than one hour.
	 *
	 * @param scrapedAtColumnName the name of the column containing the timestamp.
	 * @return the filter.
	 */
	public static String atLeastOneHourAgoFilter(String scrapedAtColumnName) {
		String oneHourAgoEncoded = urlEncode(ZonedDateTime.now()
			.minusHours(1)
			.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		return "or=(%s.is.null,%s.lte.%s)".formatted(scrapedAtColumnName, scrapedAtColumnName, oneHourAgoEncoded);
	}
}
