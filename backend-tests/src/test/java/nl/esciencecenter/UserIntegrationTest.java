// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@ExtendWith({SetupAllTests.class})
public class UserIntegrationTest {

	@Test
	void givenUser_whenUpdatingUpdatedAtFieldsForAccount_thenChangesIgnored() {
		User user = User.create();
		String accountId = user.accountId;


		JsonPath body = RestAssured.given()
				.header(user.authHeader)
				.when()
				.get("account?select=agree_terms_updated_at,notice_privacy_statement_updated_at&id=eq.%s".formatted(accountId))
				.then()
				.statusCode(200)
				.extract()
				.jsonPath();

		ZonedDateTime agree_terms_updated_at_database_old = ZonedDateTime.parse(body.getString("[0].agree_terms_updated_at"));
		ZonedDateTime notice_privacy_statement_updated_at_database_old = ZonedDateTime.parse(body.getString("[0].notice_privacy_statement_updated_at"));

		ZonedDateTime agree_terms_updated_at_future = ZonedDateTime.now().plusDays(10);
		ZonedDateTime notice_privacy_statement_updated_at_future = ZonedDateTime.now().plusMonths(10);

		String patchBody = "{\"agree_terms_updated_at\": \"%s\", \"notice_privacy_statement_updated_at\": \"%s\"}"
				.formatted(agree_terms_updated_at_future.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME), notice_privacy_statement_updated_at_future.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

		RestAssured.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body(patchBody)
				.when()
				.patch("account?id=eq.%s".formatted(accountId))
				.then()
				.statusCode(204);

		JsonPath bodyNew = RestAssured.given()
				.header(user.authHeader)
				.when()
				.get("account?select=agree_terms_updated_at,notice_privacy_statement_updated_at&id=eq.%s".formatted(accountId))
				.then()
				.statusCode(200)
				.extract()
				.jsonPath();

		ZonedDateTime agree_terms_updated_at_database_new = ZonedDateTime.parse(bodyNew.getString("[0].agree_terms_updated_at"));
		ZonedDateTime notice_privacy_statement_updated_at_database_new = ZonedDateTime.parse(bodyNew.getString("[0].notice_privacy_statement_updated_at"));

		Assertions.assertEquals(agree_terms_updated_at_database_old, agree_terms_updated_at_database_new);
		Assertions.assertNotEquals(agree_terms_updated_at_database_old, agree_terms_updated_at_future);
		Assertions.assertEquals(notice_privacy_statement_updated_at_database_old, notice_privacy_statement_updated_at_database_new);
		Assertions.assertNotEquals(notice_privacy_statement_updated_at_database_new, notice_privacy_statement_updated_at_future);
	}
}
