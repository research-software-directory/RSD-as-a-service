// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class CranScraperTest {

	@ParameterizedTest
	@CsvSource({
			"https://CRAN.R-project.org/package=TIMP,TIMP",
			"https://CRAN.R-project.org/package=TIMP/,TIMP",
			"https://cran.r-project.org/package=splithalfr,splithalfr",
			"https://cran.r-project.org/web/packages/GGIR,GGIR",
			"https://cran.r-project.org/web/packages/GGIR/,GGIR",
			"https://cran.r-project.org/web/packages/GGIR/index.html,GGIR",
			"https://cran.r-project.org/web/packages/GGIR/index.html/,GGIR"
	})
	void givenValidCranUrl_whenCallingConstructor_thenNoExceptionThrownAndPackageNamesCorrect(String url, String expectedPackageName) {
		CranScraper cranScraper = Assertions.assertDoesNotThrow(() -> new CranScraper(url));
		Assertions.assertEquals(expectedPackageName, cranScraper.packageName);
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"https://cran.r-project.org/web/packages/",
			"https://cran.r-project.org/web/packages/GG IR",
			"https://cran.r-project.org/web/packages/GGIR ",
			"https://cran.r-project.org/web/packages/GGIR /",
			"https://CRAN.R-project.org/package=",
			"https://CRAN.R-project.org/package=TIMP ",
			"https://CRAN.R-project.org/package=TI MP ",
			"https://CRAN.R-project.org/package=TIMP /",
			"https://www.example.com",
			""
	})
	void givenInvalidCranUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(RuntimeException.class, () -> new CranScraper(url));
	}

	@ParameterizedTest
	@NullSource
	void givenNullUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(NullPointerException.class, () -> new CranScraper(url));
	}
}
