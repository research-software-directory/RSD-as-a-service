// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class OpenalexIdTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"https://openalex.org/W3160330321",
			"https://openalex.org/w3160330321",
			"https://openalex.org/W152867311",
	})
	void givenValidOpenalexId_whenInstanceCreated_thenNoExceptionThrown(String validId) {
		OpenalexId openalexId = Assertions.assertDoesNotThrow(() -> OpenalexId.fromString(validId));
		Assertions.assertNotNull(openalexId);
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"http://openalex.org/W3160330321",
			"https://openalex.org/3160330321",
			"https://openalex.org/W3160330321/",
			"https://openalex.org/works/W3160330321",
			"W3160330321",
			"",
	})
	void givenInValidOpenalexId_whenCreatingInstance_thenExceptionThrown(String invalidId) {
		Assertions.assertThrows(RuntimeException.class, () -> OpenalexId.fromString(invalidId));
	}

	@Test
	void givenTwoValidIdsThatOnlyDifferInCase_whenComparing_thenTheyAreEqual() {
		String upperCaseId = "https://openalex.org/W3160330321";
		String lowerCaseId = "https://openalex.org/w3160330321";

		OpenalexId openalexId1 = OpenalexId.fromString(upperCaseId);
		OpenalexId openalexId2 = OpenalexId.fromString(lowerCaseId);

		Assertions.assertEquals(openalexId1, openalexId2);
	}
}
