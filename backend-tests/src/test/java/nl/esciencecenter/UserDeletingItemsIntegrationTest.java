// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({SetupAllTests.class})
public class UserDeletingItemsIntegrationTest {

	@Test
	void givenAnonymousUser_whenCallingSoftwareDeleteEndpoint_thenErrorReturned() {
		String softwareSlug = Commons.createUUID();
		String softwareId = RestAssured
				.given()
				.header(SetupAllTests.adminAuthHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"slug\":  \"%s\", \"is_published\": true, \"brand_name\": \"test software\"}".formatted(softwareSlug))
				.when()
				.post("software")
				.then()
				.statusCode(201)
				.extract()
				.jsonPath()
				.getString("[0].id");

		String errorMessage = RestAssured
				.given()
				.contentType(ContentType.JSON)
				.body("{\"id\": \"%s\"}".formatted(softwareId))
				.when()
				.post("rpc/delete_software")
				.then()
				.statusCode(400)
				.extract()
				.jsonPath()
				.getString("message");

		Assertions.assertEquals("You are not allowed to delete this software", errorMessage);
	}

	@Test
	void givenRegularUser_whenCallingSoftwareDeleteEndpoint_thenErrorReturned() {
		User user = User.create(true);

		String softwareSlug = Commons.createUUID();
		String softwareId = RestAssured
				.given()
				.header(user.authHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"slug\":  \"%s\", \"is_published\": true, \"brand_name\": \"test software\"}".formatted(softwareSlug))
				.when()
				.post("software")
				.then()
				.statusCode(201)
				.extract()
				.jsonPath()
				.getString("[0].id");

		String errorMessage = RestAssured
				.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"id\": \"%s\"}".formatted(softwareId))
				.when()
				.post("rpc/delete_software")
				.then()
				.statusCode(400)
				.extract()
				.jsonPath()
				.getString("message");

		Assertions.assertEquals("You are not allowed to delete this software", errorMessage);
	}

	@Test
	void givenRegularUser_whenCallingProjectDeleteEndpoint_thenErrorReturned() {
		User user = User.create(true);

		String projectSlug = Commons.createUUID();
		String projectId = RestAssured
				.given()
				.header(user.authHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"slug\":  \"%s\", \"is_published\": true, \"title\": \"test project\"}".formatted(projectSlug))
				.when()
				.post("project")
				.then()
				.statusCode(201)
				.extract()
				.jsonPath()
				.getString("[0].id");

		String errorMessage = RestAssured
				.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"id\": \"%s\"}".formatted(projectId))
				.when()
				.post("rpc/delete_project")
				.then()
				.statusCode(400)
				.extract()
				.jsonPath()
				.getString("message");

		Assertions.assertEquals("You are not allowed to delete this project", errorMessage);
	}


	@Test
	void givenRegularUser_whenCallingOrganisationDeleteEndpoint_thenErrorReturned() {
		User user = User.create(true);

		String organisationSlug = Commons.createUUID();
		String organisationId = RestAssured
				.given()
				.header(user.authHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"slug\":  \"%s\", \"name\": \"test organisation\"}".formatted(organisationSlug))
				.when()
				.post("organisation")
				.then()
				.statusCode(201)
				.extract()
				.jsonPath()
				.getString("[0].id");

		String errorMessage = RestAssured
				.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"id\": \"%s\"}".formatted(organisationId))
				.when()
				.post("rpc/delete_organisation")
				.then()
				.statusCode(400)
				.extract()
				.jsonPath()
				.getString("message");

		Assertions.assertEquals("You are not allowed to delete this organisation", errorMessage);
	}

	@Test
	void givenRegularUser_whenCallingCommunityDeleteEndpoint_thenErrorReturned() {
		String communitySlug = Commons.createUUID();
		String communityId = RestAssured
				.given()
				.header(SetupAllTests.adminAuthHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"slug\":  \"%s\", \"name\": \"test community\"}".formatted(communitySlug))
				.when()
				.post("community")
				.then()
				.statusCode(201)
				.extract()
				.jsonPath()
				.getString("[0].id");

		User user = User.create(true);
		String errorMessage = RestAssured
				.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"id\": \"%s\"}".formatted(communityId))
				.when()
				.post("rpc/delete_community")
				.then()
				.statusCode(400)
				.extract()
				.jsonPath()
				.getString("message");

		Assertions.assertEquals("You are not allowed to delete this community", errorMessage);
	}
}
