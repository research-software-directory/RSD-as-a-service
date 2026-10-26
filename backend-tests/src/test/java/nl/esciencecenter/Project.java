// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

public class Project {

	public final UUID id;
	private int testimonialCount = 0;

	private Project(UUID id) {
		this.id = id;
	}

	/**
	 * Create a new project that is stored in the database.
	 *
	 * @param user The user to create the project
	 * @param title The title of the new project
	 * @return A handle of the new project
	 */
	public static Project createNewProject(User user, String title) {
		JsonObject projectJson = createProjectJson(title);

		String id = RestAssured.given()
			.header(user.authHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(projectJson.toString())
			.when()
			.post("project")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		return new Project(UUID.fromString(id));
	}

	/**
	 * Unpublish this project.
	 *
	 * @param user The user to perform the action
	 */
	public void unpublish(User user) {
		RestAssured.given()
			.header(user.authHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body("{\"is_published\": false}")
			.when()
			.patch("project")
			.then()
			.statusCode(200);
	}

	/**
	 * Add a new testimonial to this project.
	 *
	 * @param user The user to perform the action
	 * @param message The message of the testimonial
	 * @param source The source of the testimonial
	 * @return The ID of the new testimonial
	 */
	public UUID addTestimonial(User user, String message, String source) {
		String id = RestAssured.given()
			.header(user.authHeader)
			.header(Commons.returnRepresentationHeader)
			.contentType(ContentType.JSON)
			.body(createTestimonialJson(message, source, testimonialCount + 1).toString())
			.when()
			.post("testimonial_for_project")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		++testimonialCount;
		return UUID.fromString(id);
	}

	/**
	 * Get the testimonial IDs of this project as an authenticated user.
	 *
	 * @param user The user to query the testimonial IDs
	 * @return The testimonial IDs visible to the user
	 */
	public Collection<UUID> getTestimonialIds(User user) {
		return RestAssured.given()
			.header(user.authHeader)
			.when()
			.get("testimonial_for_project?project=eq." + id.toString())
			.then()
			.statusCode(200)
			.extract()
			.body()
			.jsonPath()
			.getList(".")
			.stream()
			.map(obj -> (Map<?, ?>) obj)
			.map(map -> (String) map.get("id"))
			.map(UUID::fromString)
			.toList();
	}

	/**
	 * Get the testimonial IDs of this project as an anonymous user
	 *
	 * @return The testimonial IDs visible to the anonymous user
	 */
	public Collection<UUID> getTestimonialIds() {
		return RestAssured.given()
			.when()
			.get("testimonial_for_project?project=eq." + id.toString())
			.then()
			.statusCode(200)
			.extract()
			.body()
			.jsonPath()
			.getList(".")
			.stream()
			.map(obj -> (Map<?, ?>) obj)
			.map(map -> (String) map.get("id"))
			.map(UUID::fromString)
			.toList();
	}

	/**
	 * Attempt to remove a project testimonial. Because of how PostgREST works, no guarantee
	 * is given that the testimonial is actually removed.
	 *
	 * @param user The user that should perform the delete action
	 * @param testimonialId The ID of the testimonial to remove
	 */
	public void deleteTestimonial(User user, UUID testimonialId) {
		RestAssured.given()
			.header(user.authHeader)
			.when()
			.delete("testimonial_for_project?id=eq." + testimonialId.toString())
			.then()
			.statusCode(204);
	}

	/**
	 * Attempt to remove a project testimonial.
	 * Because this is done by an anonymous user, this should fail.
	 *
	 * @param testimonialId The ID of the testimonial to remove
	 */
	public void deleteTestimonial(UUID testimonialId) {
		RestAssured.given()
			.when()
			.delete("testimonial_for_project?id=eq." + testimonialId.toString())
			.then()
			.statusCode(401);
	}

	private static JsonObject createProjectJson(String title) {
		JsonObject obj = new JsonObject();

		String slug = Commons.slugify(title) + "-" + Commons.createUUID();
		obj.addProperty("slug", slug);
		obj.addProperty("title", title);
		obj.addProperty("is_published", true);
		String shortStatement = title + " was created by the backend tests";
		obj.addProperty("description", shortStatement);

		return obj;
	}

	private JsonObject createTestimonialJson(String message, String source, int position) {
		JsonObject obj = new JsonObject();

		obj.addProperty("project", id.toString());
		obj.addProperty("message", message);
		obj.addProperty("source", source);
		obj.addProperty("position", position);

		return obj;
	}
}
