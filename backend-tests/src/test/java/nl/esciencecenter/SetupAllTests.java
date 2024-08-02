// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.restassured.RestAssured;
import io.restassured.http.Header;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;

public class SetupAllTests implements BeforeAllCallback {

	@Override
	public void beforeAll(ExtensionContext extensionContext) throws Exception {
		checkBackendAvailable();
		setupRestAssured();
	}

	public static Header adminAuthHeader;

	public static void checkBackendAvailable() throws InterruptedException {
		URI backendUri = URI.create(System.getenv("POSTGREST_URL"));
		HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
		HttpRequest request = HttpRequest.newBuilder(backendUri).build();
		int maxTries = 30;
		for (int i = 1; i <= maxTries; i++) {
			try {
				HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
				if (response.statusCode() == 200) {
					System.out.println("Attempt %d/%d to connect to the backend on %s succeeded, continuing with the tests"
							.formatted(i, maxTries, backendUri));
					client.close();
					return;
				}
				System.out.println("Attempt %d/%d to connect to the backend on %s failed, trying again in 1 second"
						.formatted(i, maxTries, backendUri));
				Thread.sleep(1000);
			} catch (IOException e) {
				System.out.println("Attempt %d/%d to connect to the backend on %s failed, trying again in 1 second"
						.formatted(i, maxTries, backendUri));
				Thread.sleep(1000);
			}
		}
		throw new RuntimeException("Unable to make connection to the backend with URI: " + backendUri);
	}

	public static void setupRestAssured() {
		String backendUri = System.getenv("POSTGREST_URL");
		RestAssured.baseURI = backendUri;
		RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		String adminToken = JWT.create()
				.withClaim("iss", "rsd_test")
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // expires in one hour
				.sign(signingAlgorithm);
		adminAuthHeader = new Header("Authorization", "bearer " + adminToken);

		User.adminAuthHeader = adminAuthHeader;
	}
}
