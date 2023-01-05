// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

public class UtilsTest {
	private final String gitHubApiUrl = "https://api.github.com";
	private final String gitHubRepository = "research-software-directory/RSD-as-a-service";
	private final String gitHubUri = gitHubApiUrl + "/repos/" + gitHubRepository;

	private final String dbUrl = Config.backendBaseUrl();

	@Test
	void urlencode() {
		Assertions.assertEquals("one%2Ftwo", Utils.urlEncode("one/two"));
	}

	@Disabled
	@Test
	void getWithoutToken() {
		final String jsonResponse = Utils.get(gitHubUri);
		Assertions.assertTrue(jsonResponse.startsWith("{"));
	}

	@Disabled
	@Test
	void getWrongUri() {
		final String wrongUri = gitHubApiUrl + "/repos/research-software-directory/wrongRepo";
		RuntimeException thrown = Assertions.assertThrows(
			RuntimeException.class, () -> Utils.get(wrongUri)
		);
		Assertions.assertTrue(thrown.getMessage().startsWith("Error fetching data"));
	}

	@Disabled
	@Test
	void getAsAdmin() {
		String table = "repository_url";
		String value = Utils.getAsAdmin(dbUrl + "/" + table );
		Assertions.assertTrue(value.startsWith("[{\"software\":"));
	}
}
