// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class UtilsIT {

	private final String gitHubApiUrl = "https://api.github.com";
	private final String gitHubRepository = "research-software-directory/RSD-as-a-service";
	private final String gitHubUri = gitHubApiUrl + "/repos/" + gitHubRepository;
	private final String dbUrl = Config.backendBaseUrl();

	@Disabled
	@Test
	void getWithoutToken() {
		final String jsonResponse = Assertions.assertDoesNotThrow(() -> Utils.get(gitHubUri));
		Assertions.assertTrue(jsonResponse.startsWith("{"));
	}

	@Disabled
	@Test
	void getWrongUri() {
		final String wrongUri = gitHubApiUrl + "/repos/research-software-directory/wrongRepo";
		Exception thrown = Assertions.assertThrows(
			Exception.class, () -> Utils.get(wrongUri)
		);
		Assertions.assertTrue(thrown.getMessage().startsWith("Error fetching data"));
	}

	@Disabled
	@Test
	void getAsAdmin() {
		String table = "repository_url";
		String value = Utils.getAsAdmin(dbUrl + "/" + table);
		Assertions.assertTrue(value.startsWith("[{\"software\":"));
	}
}
