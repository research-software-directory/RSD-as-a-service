// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class Utils {

	public static String jsonElementToString(JsonElement elementToConvert) {
		if (elementToConvert == null || elementToConvert.isJsonNull()) return null;
		if (!elementToConvert.isJsonPrimitive()) return null;
		return elementToConvert.getAsString();
	}

	public static URI getTokenUrlFromWellKnownUrl(URI wellKnownUrl) {
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder(wellKnownUrl).build();
		HttpResponse<String> response;

		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}

		return extractTokenUrlFromWellKnownData(response.body());
	}

	static URI extractTokenUrlFromWellKnownData(String jsonData) {
		JsonObject dataAsObject = JsonParser.parseString(jsonData).getAsJsonObject();
		String tokenUrl = dataAsObject.getAsJsonPrimitive("token_endpoint").getAsString();
		return URI.create(tokenUrl);
	}

}
