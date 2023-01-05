// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;


public class GitLabSITest {
	private final String baseApiUrl = "https://git.gfz-potsdam.de/api";
	private final String repo = "swc-bb/swc-templates/swc-l/python";
	private final GitLabSI scraper = new GitLabSI(baseApiUrl, repo);

	@Disabled
	@Test
	void languages() {
		final String languages = scraper.languages();
		Assertions.assertTrue(languages.startsWith("{"));
		Assertions.assertTrue(languages.endsWith("}"));
		Assertions.assertTrue(languages.contains("Python"));
	}

	@Disabled
	@Test
	void license() {
		Assertions.assertEquals("MIT License", scraper.license());
	}

	@Disabled
	@Test
	void licenseDoesNotExist() {
		// unlicensed projects should return null
		// we need to find a suitable project or create a mocked interface
		Assertions.assertEquals(null, scraper.license());
	}

	@Disabled
	@Test
	void contributions() {
		final CommitsPerWeek contributions = scraper.contributions();
		// Assertions.assertTrue(contributions.contains("360071ec98b3c0d38ac8e7f0abacc05098c90311"));
		// Assertions.assertTrue(contributions.contains("2019-10-24T16:40:44.000+02:00"));
	}
}
