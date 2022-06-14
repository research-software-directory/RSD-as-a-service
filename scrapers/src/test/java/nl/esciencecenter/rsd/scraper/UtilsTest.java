// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.time.ZonedDateTime;

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

	@Test
	void collapseToWeekUTC() {
		ZonedDateTime date = ZonedDateTime.parse("2022-04-13T11:50:22.001+02:00");
		ZonedDateTime weekDate = Utils.collapseToWeekUTC(date);
		ZonedDateTime expectedDate = ZonedDateTime.parse("2022-04-10T00:00:00.000+00:00");
		Assertions.assertEquals(expectedDate, weekDate);
	}
}
