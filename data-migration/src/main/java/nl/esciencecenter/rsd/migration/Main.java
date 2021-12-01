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
		JsonArray allSoftwareFromLegacyRSD = JsonParser.parseString(allSoftwareString).getAsJsonArray();

		tryBackendConnection();

		JsonArray allSoftwareToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareToSave = new JsonObject();
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			this entry is problematic, it contains many null's, we skip it for now, whe should later either allow more
//			null fields or set default empty strings as values
			if (softwareFromLegacyRSD.get("slug").getAsString().equals("palmetto-position-lucene-wikipedia")) return;

			softwareToSave.add("slug", softwareFromLegacyRSD.get("slug"));
			softwareToSave.add("brand_name", softwareFromLegacyRSD.get("brandName"));
			softwareToSave.add("bullets", softwareFromLegacyRSD.get("bullets"));
			softwareToSave.add("get_started_url", softwareFromLegacyRSD.get("getStartedURL"));
			softwareToSave.add("is_featured", softwareFromLegacyRSD.get("isFeatured"));
			softwareToSave.add("is_published", softwareFromLegacyRSD.get("isPublished"));
			softwareToSave.add("read_more", softwareFromLegacyRSD.get("readMore"));
			softwareToSave.add("short_statement", softwareFromLegacyRSD.get("shortStatement"));

			allSoftwareToSave.add(softwareToSave);
		});
		post(URI.create(PORSGREST_URI + "/software"), allSoftwareToSave.toString());
	}

	public static void tryBackendConnection() {
		int maxTries = 20;
		for (int tryConnectionCount = 0; tryConnectionCount < maxTries; tryConnectionCount++) {
			pauseExecution(500);
			try {
				get(URI.create(PORSGREST_URI));
			} catch (RuntimeException e) {
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
