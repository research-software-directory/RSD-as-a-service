// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;

import java.util.Date;

public class User {
	String accountId;
	String token;
	Header authHeader;

	static Header adminAuthHeader;

	static User create(boolean hasAgreedTerms) {
		if (adminAuthHeader == null) {
			throw new RuntimeException("User.adminAuthHeader is not initialized.");
		}

		String accountId = RestAssured.given()
				.header(adminAuthHeader)
				.header(Commons.requestEntry)
				.when()
				.post("account")
				.then()
				.statusCode(201)
				.extract()
				.path("[0].id");

		return new User(accountId, hasAgreedTerms);
	}

	static User create() {
		return create(true);
	}

	User agreeTerms() {
		JsonObject obj = new JsonObject();
		obj.addProperty("agree_terms", true);
		obj.addProperty("notice_privacy_statement", true);

		RestAssured.given()
				.header(authHeader)
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.patch("account?id=eq." + accountId)
				.then()
				.statusCode(204);
		return this;
	}

	String createSoftware(String brand_name) {

		JsonObject obj = new JsonObject();
		obj.addProperty("slug", "slug-" + Commons.createUUID());
		obj.addProperty("brand_name", brand_name);
		obj.addProperty("is_published", true);
		obj.addProperty("short_statement", "Test software for testing");

		return RestAssured.given()
				.header(authHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.post("software")
				.then()
				.statusCode(201)
				.extract()
				.path("[0].id");
	}

	// To create User objects use create() instead.
	User(String accountId, boolean hasAgreedTerms) {
		this.accountId = accountId;
		token = createJwtToken(accountId);
		authHeader = new Header("Authorization", "bearer " + token);

		if (hasAgreedTerms) {
			agreeTerms();
		}
	}

	static String createJwtToken(String accountId) {
		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		return JWT.create()
				.withClaim("account", accountId)
				.withClaim("iss", "rsd_test")
				.withClaim("role", "rsd_user")
				.withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // expires in one hour
				.sign(signingAlgorithm);
	}
}
