// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class AuthenticationIntegrationTest {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	static String adminToken;

	static String userJwt(String account) {
		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		return JWT.create()
				.withClaim("account", account)
				.withClaim("iss", "rsd_test")
				.withClaim("role", "rsd_user")
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
	}

	static String createUser() {
		return RestAssured.given()
				.header(new Header("Authorization", "bearer " + adminToken))
				.header(new Header("Prefer", "return=representation"))
				.when()
				.post("account")
				.then()
				.statusCode(201)
				.contentType(ContentType.JSON)
				.extract()
				.path("[0].id");
	}

	@BeforeAll
	static void checkBackendAvailable() throws InterruptedException {
		URI backendUri = URI.create(System.getenv("POSTGREST_URL"));
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder(backendUri).build();
		int maxTries = 30;
		for (int i = 1; i <= maxTries; i++) {
			try {
				client.send(request, HttpResponse.BodyHandlers.discarding());
				System.out.println("Attempt %d/%d to connect to the backend on %s succeeded, continuing with the tests".formatted(i, maxTries,backendUri));
				return;
			} catch (IOException e) {
				System.out.println("Attempt %d/%d to connect to the backend on %s failed, trying again in 1 second".formatted(i, maxTries,backendUri));
				Thread.sleep(1000);
			}
		}
		throw new RuntimeException("Unable to make connection to the backend with URI: " + backendUri);
	}

	@BeforeAll
	static void setupRestAssured() {
		String backendUri = System.getenv("POSTGREST_URL");
		RestAssured.baseURI = backendUri;
		RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		adminToken = JWT.create()
				.withClaim("iss", "rsd_test")
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
	}

	@Test
	void givenAdmin_whenCreatingAccount_thenSuccess() {
		createUser();
	}

	@Test
	void givenUserWithoutAgreeingOnTerms_whenCreatingSoftware_thenNotAllowed() {
		String accountId = createUser();

		String userToken = userJwt(accountId);

		String expectedMessage = "You need to agree to our Terms of Service and the Privacy Statement before proceeding. Please open your user profile settings to agree.";
		RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"test-slug-user\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}")
				.when()
				.post("software")
				.then()
				.statusCode(400)
				.body(CoreMatchers.containsString(expectedMessage));
	}

	@Test
	void givenUserWhoAgreedOnTerms_whenCreatingAndEditingSoftware_thenSuccess() {
		String accountId = createUser();

		String userToken = userJwt(accountId);

		RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.contentType(ContentType.JSON)
				.body("{\"agree_terms\": true, \"notice_privacy_statement\": true}")
				.when()
				.patch("account?id=eq." + accountId)
				.then()
				.statusCode(204);

		String slug = UUID.randomUUID().toString();
		RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}".formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		String getStartedUrl = "https://www.example.com";
		String patchedGetStartedUrl = RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.header(new Header("Prefer", "return=representation"))
				.contentType(ContentType.JSON)
				.body("{\"get_started_url\": \"%s\"}".formatted(getStartedUrl))
				.when()
				.patch("software?select=get_started_url&slug=eq." + slug)
				.then()
				.statusCode(200)
				.extract()
				.path("[0].get_started_url");
		Assertions.assertEquals(getStartedUrl, patchedGetStartedUrl);
	}

	@Test
	void givenUserWhoAgreedOnTerms_whenEditingSoftwareNotMaintainer_thenNowAllowed() {
		String slug = UUID.randomUUID().toString();
		RestAssured.given()
				.header(new Header("Authorization", "bearer " + adminToken))
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}".formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		String accountId = createUser();

		String userToken = userJwt(accountId);

		RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.contentType(ContentType.JSON)
				.body("{\"agree_terms\": true, \"notice_privacy_statement\": true}")
				.when()
				.patch("account?id=eq." + accountId)
				.then()
				.statusCode(204);


		String getStartedUrl = "https://www.example.com";
		List response = RestAssured.given()
				.header(new Header("Authorization", "bearer " + userToken))
				.header(new Header("Prefer", "return=representation"))
				.contentType(ContentType.JSON)
				.body("{\"get_started_url\": \"%s\"}".formatted(getStartedUrl))
				.when()
				.patch("software?select=get_started_url&slug=eq." + slug)
				.then()
				.statusCode(200)
				.extract()
				.body()
				.as(List.class);
		Assertions.assertTrue(response.isEmpty());
	}

	@Test
	void givenUnauthenticatedUser_whenViewingTables_thenSuccess() {
		RestAssured
				.when()
				.get("software")
				.then()
				.statusCode(200);

		RestAssured
				.when()
				.get("project")
				.then()
				.statusCode(200);
	}

	@Test
	void givenUnauthenticatedUser_whenViewingUnpublishedSoftware_thenNothingReturned() {
		String slug = UUID.randomUUID().toString();
		RestAssured.given()
				.header(new Header("Authorization", "bearer " + adminToken))
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": false, \"short_statement\": \"Test software for testing\"}".formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		List response = RestAssured.when()
				.get("software?slug=eq."  + slug)
				.then()
				.statusCode(200)
				.extract()
				.body()
				.as(List.class);
		Assertions.assertTrue(response.isEmpty());
	}

	@Test
	void givenUnauthenticatedUser_whenEditingAnyTable_thenNotAllowed() {
		RestAssured.given()
				.contentType(ContentType.JSON)
				.body("{\"short_statement\": \"invalid statement\"}")
				.when()
				.patch("software")
				.then()
				.statusCode(401);

		RestAssured.given()
				.contentType(ContentType.JSON)
				.body("{\"subtitle\": \"invalid subtitle\"}")
				.when()
				.patch("project")
				.then()
				.statusCode(401);
	}
}
