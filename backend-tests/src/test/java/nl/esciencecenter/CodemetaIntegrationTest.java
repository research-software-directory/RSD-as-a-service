// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.RestAssured;
import java.net.URI;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({ SetupAllTests.class })
public class CodemetaIntegrationTest {

	private static final String codemetaUrl = System.getenv("CODEMETA_URL");
	private static final String codemetaEntryUrlUnformatted = codemetaUrl + "/v3/%s";

	@Test
	void whenSendingHeadRequestToCodemetaOverviewPage_thenSuccessResponseReturned() {
		RestAssured.head(URI.create(codemetaUrl)).then().statusCode(200);
	}

	@Test
	void givenPublishedSoftwarePage_whenCodemetaApiCalled_thenCorrectResponseReturned() {
		User user = User.create();
		SoftwareMetadata softwareMetadata = user.createSoftwareV1("CodeMeta software");
		String slug = softwareMetadata.slug();

		RestAssured.get(createCodemetaEntryUrl(slug))
			.then()
			.statusCode(200)
			.body("name", Matchers.equalTo(softwareMetadata.brandName()))
			.body("description[0]", Matchers.equalTo(softwareMetadata.shortStatement()));
	}

	private static URI createCodemetaEntryUrl(String slug) {
		return URI.create(codemetaEntryUrlUnformatted.formatted(slug));
	}
}
