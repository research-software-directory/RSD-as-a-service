// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.StringJoiner;

public class Utils {

	private Utils() {
	}

	public static URI getTokenUrlFromWellKnownUrl(URI wellKnownUrl) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder(wellKnownUrl).build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response;
			response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
			return extractTokenUrlFromWellKnownData(response.body());
		}
	}

	public static URI extractTokenUrlFromWellKnownData(String jsonData) {
		JsonObject dataAsObject = JsonParser.parseString(jsonData).getAsJsonObject();
		String tokenUrl = dataAsObject.getAsJsonPrimitive("token_endpoint").getAsString();
		return URI.create(tokenUrl);
	}

	public static String formMapToxWwwFormUrlencoded(Map<String, String> form) {
		StringJoiner x_www_form_urlencoded = new StringJoiner("&");
		form.forEach((key, value) -> x_www_form_urlencoded.add(key + "=" + value));
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

	public static String postForm(URI uri, Map<String, String> form) throws IOException, InterruptedException, RsdResponseException {
		HttpRequest request = formToHttpRequest(uri, form);
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 300) {
				throw new RsdResponseException(response.statusCode(), response.uri(), response.body(), "Error posting form");
			}
			return response.body();
		}
	}
}
