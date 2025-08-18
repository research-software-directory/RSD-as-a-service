// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({ SetupAllTests.class })
public class MetaPagesIntegrationTest {

	@Test
	void givenUnpublishedMetaPage_whenQueryingAnonymously_thenNothingFound() {
		String unpublishedMetaPageSlug = Commons.createUUID();
		RestAssured.given()
			.header(SetupAllTests.adminAuthHeader)
			.contentType(ContentType.JSON)
			.body(
				"{\"slug\": \"%s\", \"is_published\": false, \"title\": \"test meta page %s\"}".formatted(
					unpublishedMetaPageSlug,
					unpublishedMetaPageSlug
				)
			)
			.when()
			.post("meta_page")
			.then()
			.statusCode(201);

		List<?> anonymousResponse = RestAssured.get("meta_page?slug=eq." + unpublishedMetaPageSlug)
			.then()
			.statusCode(200)
			.extract()
			.body()
			.as(List.class);
		Assertions.assertTrue(anonymousResponse.isEmpty());

		List<?> adminResponse = RestAssured.given()
			.header(SetupAllTests.adminAuthHeader)
			.get("meta_page?slug=eq." + unpublishedMetaPageSlug)
			.then()
			.statusCode(200)
			.extract()
			.body()
			.as(List.class);
		Assertions.assertEquals(1, adminResponse.size());
	}
}
