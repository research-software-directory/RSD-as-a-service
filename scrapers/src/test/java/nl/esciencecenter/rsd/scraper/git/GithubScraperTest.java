// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.List;

public class GithubScraperTest {
	private final String apiUrl = "https://api.github.com";
	private final String repo = "research-software-directory/RSD-as-a-service";
	private final String repoEmpty = "cmeessen/empty";
	private final String repoNonEx = "research-software-directory/does-not-exist";

	private final GithubScraper githubScraper = new GithubScraper(apiUrl, repo);
	private final GithubScraper githubScraperEmpty = new GithubScraper(apiUrl, repoEmpty);
	private final GithubScraper githubScraperNonEx = new GithubScraper(apiUrl, repoNonEx);

	@Disabled
	@Test
	void languages() {
		final String languages = githubScraper.languages();
		Assertions.assertTrue(languages.startsWith("{"));
		Assertions.assertTrue(languages.endsWith("}"));
		Assertions.assertTrue(languages.contains("Java"));
	}

	@Disabled
	@Test
	void license() {
		Assertions.assertEquals("Apache-2.0", githubScraper.basicData().license);
	}

	@Disabled
	@Test
	void contributions() {
		final CommitsPerWeek contributions = githubScraper.contributions();
		// Assertions.assertTrue(contributions.startsWith("[{\"total"));
	}

	@Disabled
	@Test
	void contributionsEmpty() {
		final CommitsPerWeek contributionsEmpty = githubScraperEmpty.contributions();
		// Assertions.assertTrue("[]", contributionsEmpty);
	}

	@Disabled
	@Test
	void contributionsNonEx() {
		final CommitsPerWeek contributionsNonEx = githubScraperNonEx.contributions();
		// Assertions.assertNull(contributionsNonEx);
	}

	@Test
	void givenListWithLastPageHeader_whenParsing_thenCorrectPageReturned() {
		List<String> singleLinkList = List.of("<https://api.github.com/repositories/413814951/contributors?per_page=1&page=2>; rel=\"next\", <https://api.github.com/repositories/413814951/contributors?per_page=1&page=9>; rel=\"last\"");

		String[] lastPageData = GithubScraper.lastPageFromLinkHeader(singleLinkList);
		Assertions.assertEquals(2, lastPageData.length);
		Assertions.assertEquals("https://api.github.com/repositories/413814951/contributors?per_page=1&page=9", lastPageData[0]);
		Assertions.assertEquals("9", lastPageData[1]);
	}

	@Test
	void givenListWithoutLastPage_whenParsing_thenExceptionThrown() {
		List<String> singleLinkList = List.of("invalid");

		Assertions.assertThrows(RuntimeException.class, () -> GithubScraper.lastPageFromLinkHeader(singleLinkList));
	}
}
