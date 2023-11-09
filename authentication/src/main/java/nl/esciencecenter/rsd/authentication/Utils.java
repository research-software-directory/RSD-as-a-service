// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
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

public class Utils {

	public static URI getTokenUrlFromWellKnownUrl(URI wellKnownUrl) throws IOException, InterruptedException {
		HttpRequest request = HttpRequest.newBuilder(wellKnownUrl).build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response;
			response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
			return extractTokenUrlFromWellKnownData(response.body());
		}
	}

	static URI extractTokenUrlFromWellKnownData(String jsonData) {
		JsonObject dataAsObject = JsonParser.parseString(jsonData).getAsJsonObject();
		String tokenUrl = dataAsObject.getAsJsonPrimitive("token_endpoint").getAsString();
		return URI.create(tokenUrl);
	}

}
