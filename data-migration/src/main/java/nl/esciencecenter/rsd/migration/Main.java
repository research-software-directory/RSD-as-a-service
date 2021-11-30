package nl.esciencecenter.rsd.migration;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {

	public static final String LEGACY_RSD_SOFTWARE_URI = "https://research-software.nl/api/software";
	public static final String PORSGREST_URI = "http://localhost:3000";

	public static void main(String[] args) {
		String allSoftwareString = get(URI.create(LEGACY_RSD_SOFTWARE_URI));
		JsonArray allSoftware = JsonParser.parseString(allSoftwareString).getAsJsonArray();

		tryBackendConnection();

		JsonArray allSoftwareToSave = new JsonArray();
		allSoftware.forEach(jsonElement -> {
			JsonObject softwareToSave = new JsonObject();
			softwareToSave.add("brand_name", jsonElement.getAsJsonObject().get("brandName"));
			softwareToSave.add("read_more", jsonElement.getAsJsonObject().get("readMore"));
			softwareToSave.add("slug", jsonElement.getAsJsonObject().get("slug"));
			allSoftwareToSave.add(softwareToSave);
		});
		post(URI.create(PORSGREST_URI + "/software"), allSoftwareToSave.toString());
	}

	public static void tryBackendConnection() {
		int maxTries = 6;
		for (int tryConnectionCount = 0; tryConnectionCount < maxTries; tryConnectionCount++) {
			try {
				get(URI.create(PORSGREST_URI));
			} catch (RuntimeException e) {
				pauseExecution(2000);
				continue;
			}
			return;
		}
		throw new RuntimeException("Connection to the backend could not be established");
	}

	public static void pauseExecution(long milis) {
		try {
			Thread.sleep(milis);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
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

	public static String post(URI uri, String json) {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
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
