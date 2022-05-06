package nl.esciencecenter.rsd.authentication;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;
import java.util.UUID;

public class PostgrestInvitations {

	private final URI baseAddress;

	public PostgrestInvitations(URI baseAddress) {
		this.baseAddress = Objects.requireNonNull(baseAddress);
	}

	public ProjectInfo acceptProjectInvitation(UUID inviteId, UUID accountId) {
		String adminToken = new JwtCreator(Config.jwtSigningSecret()).createAdminJwt();
		String body = """
				{
					"claimed_by": "%s"
				}""".formatted(accountId.toString());
		URI endpoint = URI.create(baseAddress + "/invite_maintainer_for_project?id=eq." + inviteId);
		String responseBody = patchJsonAsAdmin(endpoint, body, adminToken);
		return null;
	}

	private String patchJsonAsAdmin(URI uri, String json, String token) {
		HttpRequest request = HttpRequest.newBuilder()
				.method("PATCH", HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.header("Prefer", "return=representation")
				.header("Authorization", "bearer " + token)
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
