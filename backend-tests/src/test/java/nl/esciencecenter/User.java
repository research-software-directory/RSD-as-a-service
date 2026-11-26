// SPDX-FileCopyrightText: 2024 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.http.Header;
import io.restassured.response.Response;
import java.time.LocalDate;
import java.util.Date;

public class User {

	String accountId;
	String jwtToken;

	Header authHeader;
	boolean isAdmin;
	Cookie authCookie;

	String accessToken;
	Header accessTokenHeader;

	static Header adminAuthHeader;

	// public so that tests in other packages can use it
	public Header getAuthHeader() {
		return authHeader;
	}

	// public so that tests in other packages can use it
	public String getAccountId() {
		return accountId;
	}

	// public so that tests in other packages can use it
	public boolean getIsAdmin() {
		return isAdmin;
	}

	// public so that tests in other packages can use it
	public static Header getAdminAuthHeader() {
		return adminAuthHeader;
	}

	public static User create(boolean hasAgreedTerms, boolean isAdmin) {
		if (adminAuthHeader == null) {
			throw new RuntimeException("User.adminAuthHeader is not initialized.");
		}

		String accountId = RestAssured.given()
			.header(adminAuthHeader)
			.header(Commons.returnRepresentationHeader)
			.when()
			.post("account")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		JsonObject userProfileData = new JsonObject();
		userProfileData.addProperty("account", accountId);
		userProfileData.addProperty("given_names", "test");
		userProfileData.addProperty("family_names", "user");
		userProfileData.addProperty("email_address", "test@example.com");
		userProfileData.addProperty("is_public", true);

		RestAssured.given()
			.header(adminAuthHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(userProfileData.toString())
			.when()
			.post("user_profile")
			.then()
			.statusCode(201);

		if (isAdmin) {
			JsonObject adminAccountData = new JsonObject();
			adminAccountData.addProperty("account_id", accountId);

			RestAssured.given()
				.header(adminAuthHeader)
				.header(Commons.returnRepresentationHeader)
				.contentType(ContentType.JSON)
				.body(adminAccountData.toString())
				.when()
				.post("admin_account")
				.then()
				.statusCode(201);
		}

		return new User(accountId, hasAgreedTerms, isAdmin);
	}

	public static User create(boolean hasAgreedTerms) {
		return create(hasAgreedTerms, false);
	}

	/**
	 *
	 * @return a user that has accepted the terms and conditions
	 */
	static User create() {
		return create(true, false);
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

	// public so that tests in other packages can use it
	public SoftwareMetadata createSoftwareV1(String brandName) {
		JsonObject softwareJson = createSoftwareJson(brandName);
		String slug = softwareJson.getAsJsonPrimitive("slug").getAsString();
		String shortStatement = softwareJson.getAsJsonPrimitive("short_statement").getAsString();

		String softwareId = RestAssured.given()
			.header(authHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(softwareJson.toString())
			.when()
			.post("software")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		return new SoftwareMetadata(softwareId, slug, brandName, shortStatement);
	}

	SoftwareMetadata createSoftwareV2(String brandName) {
		JsonObject softwareJson = createSoftwareJson(brandName);
		String slug = softwareJson.getAsJsonPrimitive("slug").getAsString();
		String shortStatement = softwareJson.getAsJsonPrimitive("short_statement").getAsString();

		String softwareId = RestAssured.given()
			.header(accessTokenHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(softwareJson.toString())
			.when()
			.post(Commons.apiV2Url + "/software")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		return new SoftwareMetadata(softwareId, slug, brandName, shortStatement);
	}

	static JsonObject createSoftwareJson(String brandName) {
		JsonObject obj = new JsonObject();
		String slug = "slug-" + Commons.createUUID();
		obj.addProperty("slug", slug);
		obj.addProperty("brand_name", brandName);
		obj.addProperty("is_published", true);
		String shortStatement = "Test software for testing";
		obj.addProperty("short_statement", shortStatement);

		return obj;
	}

	/**
	 * Request an access token for version 2 of the API to be generated. When successful, the token is returned and
	 * will be automatically used for any subsequent requests to that API.
	 *
	 * @param displayName the display name of the token which is in the frontend presented to the user
	 * @param expiresAt the date at which the token will expire
	 * @return the newly generated access token, which is also stored in this User instance
	 */
	public String createAndUseAccessToken(String displayName, LocalDate expiresAt) {
		accessToken = createAccessToken(displayName, expiresAt).then().statusCode(201).extract().path("access_token");
		accessTokenHeader = new Header("Authorization", "bearer " + accessToken);

		return accessToken;
	}

	/**
	 * Request an access token for version 2 of the API to be generated. The response is returned for further testing
	 * purposes. This User is not mutated.
	 *
	 * @param displayName the display name of the token which is in the frontend presented to the user
	 * @param expiresAt the date at which the token will expire
	 * @return the HTTP response corresponding to the request of creating the access token
	 */
	public Response createAccessToken(String displayName, LocalDate expiresAt) {
		String body = "{\"display_name\": \"%s\", \"expires_at\": \"%s\"}".formatted(displayName, expiresAt);

		return RestAssured.given()
			.cookie(authCookie)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(body)
			.when()
			.post(Commons.authUrl + "/accesstoken");
	}

	// To create User objects use create() instead.
	User(String accountId, boolean hasAgreedTerms, boolean isAdmin) {
		this.accountId = accountId;
		this.isAdmin = isAdmin;
		jwtToken = createJwtToken(accountId, isAdmin);
		authHeader = new Header("Authorization", "bearer " + jwtToken);
		authCookie = new Cookie.Builder("rsd_token", jwtToken).build();

		if (hasAgreedTerms) {
			agreeTerms();
		}
	}

	static String createJwtToken(String accountId, boolean isAdmin) {
		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		String role = isAdmin ? "rsd_admin" : "rsd_user";

		return JWT.create()
			.withClaim("account", accountId)
			.withClaim("iss", "rsd_test")
			.withClaim("role", role)
			.withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // expires in one hour
			.sign(signingAlgorithm);
	}
}
