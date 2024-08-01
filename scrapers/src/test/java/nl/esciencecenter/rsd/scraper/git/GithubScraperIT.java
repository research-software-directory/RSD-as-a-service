// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GithubScraperIT {

	private final String githubUrlPrefix = "https://github.com/";
	private final String repo = "research-software-directory/RSD-as-a-service";
	private final String repoEmpty = "cmeessen/empty";
	private final String repoNonEx = "research-software-directory/does-not-exist";

	private final GithubScraper githubScraper = GithubScraper.create(githubUrlPrefix + repo).get();
	private final GithubScraper githubScraperEmpty = GithubScraper.create(githubUrlPrefix + repoEmpty).get();
	private final GithubScraper githubScraperNonEx = GithubScraper.create(githubUrlPrefix + repoNonEx).get();

	@Disabled
	@Test
	void languages() {
		final String languages = Assertions.assertDoesNotThrow(() -> githubScraper.languages());
		Assertions.assertTrue(languages.startsWith("{"));
		Assertions.assertTrue(languages.endsWith("}"));
		Assertions.assertTrue(languages.contains("Java"));
	}

	@Disabled
	@Test
	void license() {
		String license = Assertions.assertDoesNotThrow(() -> githubScraper.basicData().license());
		Assertions.assertEquals("Apache-2.0", license);
	}

	@Disabled
	@Test
	void contributions() {
		final CommitsPerWeek contributions = Assertions.assertDoesNotThrow(githubScraper::contributions);
		// Assertions.assertTrue(contributions.startsWith("[{\"total"));
	}

	@Disabled
	@Test
	void contributionsEmpty() {
		final CommitsPerWeek contributionsEmpty = Assertions.assertDoesNotThrow(githubScraperEmpty::contributions);
		// Assertions.assertTrue("[]", contributionsEmpty);
	}

	@Disabled
	@Test
	void contributionsNonEx() {
		final CommitsPerWeek contributionsNonEx = Assertions.assertDoesNotThrow(githubScraperNonEx::contributions);
		// Assertions.assertNull(contributionsNonEx);
	}
}
