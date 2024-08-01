// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;

class CratesScraperTest {

	@ParameterizedTest
	@CsvSource({
		"https://crates.io/crates/tokio,tokio",
		"https://crates.io/crates/tokio/,tokio",
	})
	void givenValidCratesUrl_whenCallingConstructor_thenNoExceptionThrownAndPackageNamesCorrect(
		String url,
		String expectedPackageName
	) {
		CratesScraper cratesScraper = Assertions.assertDoesNotThrow(() -> new CratesScraper(url));
		Assertions.assertEquals(expectedPackageName, cratesScraper.packageName);
	}

	@ParameterizedTest
	@NullSource
	void givenNullUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(NullPointerException.class, () -> new CratesScraper(url));
	}
}
