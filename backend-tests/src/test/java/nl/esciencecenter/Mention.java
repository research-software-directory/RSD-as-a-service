// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

public class Mention {

	public final UUID id;
	public final String title;
	public final MentionType mentionType;

	private Mention(UUID id, String title, MentionType mentionType) {
		this.id = Objects.requireNonNull(id);
		this.title = Objects.requireNonNull(title);
		this.mentionType = Objects.requireNonNull(mentionType);
	}

	/**
	 * Creates and stores mention with a random title and mention type. No DOI or OpenAlex ID are generated
	 *
	 * @param user the user who should create this mention
	 *
	 * @return the randomly generated mention that is stored in the database
	 */
	public static Mention createMention(User user) {
		Objects.requireNonNull(user);

		String title = UUID.randomUUID().toString();

		MentionType[] mentionTypes = MentionType.values();
		int mentionTypeSize = mentionTypes.length;
		int randomIdx = new Random().nextInt(mentionTypeSize);
		MentionType mentionType = mentionTypes[randomIdx];

		String bodyJson = "{\"title\": \"%s\", \"mention_type\": \"%s\", \"source\": \"backend tests\"}".formatted(
			title,
			mentionType.name()
		);

		String mentionId = RestAssured.given()
			.header(user.authHeader)
			.header(Commons.requestEntry)
			.contentType(ContentType.JSON)
			.body(bodyJson)
			.when()
			.post("mention")
			.then()
			.statusCode(201)
			.extract()
			.path("[0].id");

		return new Mention(UUID.fromString(mentionId), title, mentionType);
	}
}
