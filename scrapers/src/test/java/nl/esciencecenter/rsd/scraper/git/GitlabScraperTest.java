// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.net.URI;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class GitlabScraperTest {

	@Test
	void givenCorrectJson_whenParsingReadmeUrl_thenUrlReturned() {
		String json = "{\"readme_url\": \"https://gitlab.com/gitlab-org/gitlab-shell/-/blob/main/README.md\"}";

		Optional<URI> parsedUrl = GitlabScraper.parseReadmeUrl(json);

		Assertions.assertTrue(parsedUrl.isPresent());
		Assertions.assertEquals(
			URI.create("https://gitlab.com/gitlab-org/gitlab-shell/-/raw/main/README.md"),
			parsedUrl.get()
		);
	}

	@ParameterizedTest
	@ValueSource(strings = { "{}", "{\"readme_url\": null}", "{\"readme_url\": 123}" })
	void givenMissingOrIncorrectlyStructuredJson_whenParsingReadmeUrl_thenEmptyValueReturned(String json) {
		Optional<URI> parsedUrl = GitlabScraper.parseReadmeUrl(json);

		Assertions.assertTrue(parsedUrl.isEmpty());
	}
}
