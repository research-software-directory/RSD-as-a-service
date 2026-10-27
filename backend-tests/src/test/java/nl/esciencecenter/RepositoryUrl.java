// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.net.URI;
import java.util.UUID;

public class RepositoryUrl {

	public final UUID id;

	private RepositoryUrl(UUID id) {
		this.id = id;
	}

	/**
	 * Create a repo URL entry in the database or
	 * return the existing entry.
	 *
	 * @param user The user to create the project
	 * @param url The url of the repository
	 * @return A handle of the repo URL
	 */
	public static RepositoryUrl createOrGet(User user, URI url) {
		JsonObject repoUrlJson = createRepoUrlJson(url);

		RestAssured.given()
			.header(user.authHeader)
			.header(Commons.ignoreDuplicatesHeader)
			.contentType(ContentType.JSON)
			.body(repoUrlJson.toString())
			.post("repository_url?on_conflict=url")
			.then()
			.statusCode(201);

		String id = RestAssured.given()
			.queryParam("url", "eq." + url)
			.get("repository_url")
			.then()
			.statusCode(200)
			.extract()
			.path("[0].id");

		return new RepositoryUrl(UUID.fromString(id));
	}

	/**
	 * Add this repo URL to software as authenticated user.
	 *
	 * @param user The user to perform the action
	 * @param softwareId The ID of the software to add this repo URL to
	 * @return The status code of the request
	 */
	public int addToSoftware(User user, UUID softwareId) {
		JsonObject repoUrlForSoftwareJson = createRepoUrlForSoftwareJson(softwareId);

		return RestAssured.given()
			.header(user.authHeader)
			.contentType(ContentType.JSON)
			.body(repoUrlForSoftwareJson.toString())
			.post("repository_url_for_software")
			.statusCode();
	}

	/**
	 * Add this repo URL to software as anonymous user.
	 *
	 * @param softwareId The ID of the software to add this repo URL to
	 * @return The status code of the request
	 */
	public int addToSoftware(UUID softwareId) {
		JsonObject repoUrlForSoftwareJson = createRepoUrlForSoftwareJson(softwareId);

		return RestAssured.given()
			.contentType(ContentType.JSON)
			.body(repoUrlForSoftwareJson.toString())
			.post("repository_url_for_software")
			.statusCode();
	}

	private static JsonObject createRepoUrlJson(URI url) {
		JsonObject obj = new JsonObject();

		obj.addProperty("url", url.toString());
		obj.addProperty("code_platform", "other");

		return obj;
	}

	private JsonObject createRepoUrlForSoftwareJson(UUID softwareId) {
		JsonObject obj = new JsonObject();

		obj.addProperty("repository_url", this.id.toString());
		obj.addProperty("software", softwareId.toString());
		obj.addProperty("position", 0);

		return obj;
	}
}
