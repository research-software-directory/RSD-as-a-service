// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class MavenScraperTest {

	@ParameterizedTest
	@CsvSource({
		"https://central.sonatype.com/artifact/org.openscience.cdk/cdk-bundle,org.openscience.cdk,cdk-bundle",
		"https://central.sonatype.com/artifact/org.openscience.cdk/cdk-bundle/,org.openscience.cdk,cdk-bundle",
		"https://mvnrepository.com/artifact/io.github.sanctuuary/APE,io.github.sanctuuary,APE",
		"https://mvnrepository.com/artifact/io.github.sanctuuary/APE/,io.github.sanctuuary,APE",
	})
	void givenValidMavenOrSonatypeUrl_whenCallingConstructor_thenNoExceptionThrownAndPackageNameCorrect(
		String url,
		String expectedGroupId,
		String expectedArtifactID
	) {
		MavenScraper mavenScraper = Assertions.assertDoesNotThrow(() -> new MavenScraper(url));
		Assertions.assertEquals(expectedGroupId, mavenScraper.groupId);
		Assertions.assertEquals(expectedArtifactID, mavenScraper.artifactId);
	}

	@ParameterizedTest
	@ValueSource(strings = {
		"https://central.sonatype.com/artifact",
		"https://mvnrepository.com/artifact/",
		"https://central.sonatype.com/artifact/org.openscience.cdk",
		"https://mvnrepository.com/artifact/io.github.sanctuuary/",
		"https://www.example.com",
		"https://www.example.com/artifact/org.openscience.cdk/cdk-bundle",
		""
	})
	void givenInvalidUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(RuntimeException.class, () -> new MavenScraper(url));
	}

	@ParameterizedTest
	@NullSource
	void givenNullUrl_whenCallingConstructor_thenExceptionThrown(String url) {
		Assertions.assertThrowsExactly(NullPointerException.class, () -> new MavenScraper(url));
	}
}
