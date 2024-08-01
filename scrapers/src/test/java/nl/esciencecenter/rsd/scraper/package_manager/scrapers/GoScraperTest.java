// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;

class GoScraperTest {

	@ParameterizedTest
	@CsvSource({
		"https://pkg.go.dev/github.com/gin-gonic/gin,github.com/gin-gonic/gin",
		"https://pkg.go.dev/github.com/gin-gonic/gin/,github.com/gin-gonic/gin",
		"https://pkg.go.dev/google.golang.org/grpc,google.golang.org/grpc",
		"https://pkg.go.dev/google.golang.org/grpc/,google.golang.org/grpc",
	})
	void givenValidGoUrl_whenCallingConstructor_thenNoExceptionThrownAndPackageNameCorrect(
		String url,
		String expectedPackageName
	) {
		GoScraper goScraper = Assertions.assertDoesNotThrow(() -> new GoScraper(url));
		Assertions.assertEquals(expectedPackageName, goScraper.packageName);
	}

	@ParameterizedTest
	@NullSource
	void givenNullUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(NullPointerException.class, () -> new GoScraper(url));
	}
}
