// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import java.time.LocalDate;
import java.util.UUID;
import java.util.random.RandomGenerator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({ SetupAllTests.class })
public class AccessTokenIntegrationTest {

	@Test
	void givenUser_whenCreatingAccessTokenWithinYear_thenAccessTokenReturned() {
		User user = User.create();

		String accessTokenToday = user.createAndUseAccessToken("My access token", LocalDate.now());
		Assertions.assertDoesNotThrow(() -> UUID.fromString(accessTokenToday.split("\\.")[0]));

		String accessTokenYear = user.createAndUseAccessToken("My access token", LocalDate.now().plusDays(365));
		Assertions.assertDoesNotThrow(() -> UUID.fromString(accessTokenYear.split("\\.")[0]));

		String accessTokenWithinYear = user.createAndUseAccessToken(
			"My access token",
			LocalDate.now().plusDays(RandomGenerator.getDefault().nextInt(1, 365))
		);
		Assertions.assertDoesNotThrow(() -> UUID.fromString(accessTokenWithinYear.split("\\.")[0]));
	}

	@Test
	void givenUser_whenCreatingAccessTokenInPast_thenErrorReturned() {
		User user = User.create();

		user.createAccessToken("My access token", LocalDate.now().minusDays(1)).then().statusCode(400);

		user
			.createAccessToken(
				"My access token",
				LocalDate.now().minusDays(RandomGenerator.getDefault().nextInt(2, Integer.MAX_VALUE))
			)
			.then()
			.statusCode(400);
	}

	@Test
	void givenUser_whenCreatingAccessTokenBeyondOneYear_thenErrorReturned() {
		User user = User.create();

		user.createAccessToken("My access token", LocalDate.now().plusDays(366)).then().statusCode(400);

		user
			.createAccessToken(
				"My access token",
				LocalDate.now().plusDays(RandomGenerator.getDefault().nextInt(367, Integer.MAX_VALUE))
			)
			.then()
			.statusCode(400);
	}

	@Test
	void givenUserWithAccessToken_whenCreatingSoftwareThroughV2_thenSuccess() {
		User user = User.create();
		user.createAndUseAccessToken("My access token", LocalDate.now().plusDays(3));

		String brandName = "Some software created through v2";
		SoftwareMetadata softwareMetadata = user.createSoftwareV2(brandName);

		Assertions.assertEquals(brandName, softwareMetadata.brandName());
	}

	@Test
	void givenFakeAccessToken_whenCreatingSoftwareThroughV2_thenErrorReturned() {
		User user = User.create();
		user.createAndUseAccessToken("My access token", LocalDate.now().plusDays(3));
		String fakeAccessToken = user.accessToken.split("\\.")[0] + ".abc";

		String brandName = "Some software created through v2";

		RestAssured.given()
			.header(new Header("Authorization", "bearer " + fakeAccessToken))
			.header(Commons.requestEntry)
			.contentType(ContentType.JSON)
			.body(User.createSoftwareJson(brandName).toString())
			.when()
			.post(Commons.apiV2Url + "/software")
			.then()
			.statusCode(401);
	}
}
