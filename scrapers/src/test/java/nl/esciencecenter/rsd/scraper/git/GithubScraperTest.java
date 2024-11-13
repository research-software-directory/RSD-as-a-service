// SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

class GithubScraperTest {

	private final String githubUrlPrefix = "https://github.com/";
	private final String repo = "research-software-directory/RSD-as-a-service";
	private final String repoGit = "research-software-directory/RSD-as-a-service.git";
	private final String repoEmpty = "cmeessen/empty";
	private final String repoNonEx = "research-software-directory/does-not-exist";

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

	@Test
	void givenValidGithubUrl_whenCreatingScraper_thenNonEmptyScraperReturned() {
		Optional<GithubScraper> scraper1 = GithubScraper.create(githubUrlPrefix + repo);
		Assertions.assertTrue(scraper1.isPresent());

		Optional<GithubScraper> scraper2 = GithubScraper.create(githubUrlPrefix + repoEmpty);
		Assertions.assertTrue(scraper2.isPresent());

		Optional<GithubScraper> scraper3 = GithubScraper.create(githubUrlPrefix + repoNonEx + "/");
		Assertions.assertTrue(scraper3.isPresent());
	}

	@Test
	void givenInValidGithubUrl_whenCreatingScraper_thenEmptyScraperReturned() {
		Optional<GithubScraper> scraper1 = GithubScraper.create(githubUrlPrefix + repo + "/issues");
		Assertions.assertTrue(scraper1.isEmpty());

		Optional<GithubScraper> scraper2 = GithubScraper.create(githubUrlPrefix + repoEmpty + "/tree/main");
		Assertions.assertTrue(scraper2.isEmpty());

		Optional<GithubScraper> scraper3 = GithubScraper.create(githubUrlPrefix + "org-only/");
		Assertions.assertTrue(scraper3.isEmpty());
	}

	@Test
	void givenGitRepoUrl_whenCreatingScraper_thenRemoveGitSuffix() {
		Optional<GithubScraper> scraper = GithubScraper.create(githubUrlPrefix + repoGit);
		Assertions.assertEquals(repo, scraper.get().organisation + "/" + scraper.get().repo);
	}
}
