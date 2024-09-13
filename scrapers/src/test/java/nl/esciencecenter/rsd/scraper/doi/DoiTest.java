// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class DoiTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"10.2533/chimia.2024.525",
			"10.1017/9781108881425",
			"10.3390/photonics11070630",
			"10.1093/gigascience/giad048",
			"10.1007/978-3-030-83508-8_2",
			"10.22541/essoar.171500959.99365288/v1",
			"10.1016/j.eswa.2023.120561",
	})
	void givenValidDoi_whenInstanceCreated_thenNoExceptionThrown(String validDoi) {
		Doi doi = Assertions.assertDoesNotThrow(() -> Doi.fromString(validDoi));
		Assertions.assertNotNull(doi);
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"10.2533",
			"10.2533/",
			"https://doi.org/10.2533/chimia.2024.525",
			"10.3390/photonics 11070630",
			"10.3390/photonics11070630 ",
			"11.1016/j.eswa.2023.120561",
			"",
	})
	void givenInValidDoi_whenCreatingInstance_thenExceptionThrown(String invalidDoi) {
		Assertions.assertThrows(RuntimeException.class, () -> Doi.fromString(invalidDoi));
	}

	@Test
	void givenTwoValidDoisThatOnlyDifferInCase_whenComparing_thenTheyAreEqual() {
		String upperCaseDoi = "10.2533/chimia.2024.525";
		String lowerCaseDoi = "10.2533/CHIMIA.2024.525";

		Doi doi1 = Doi.fromString(upperCaseDoi);
		Doi doi2 = Doi.fromString(lowerCaseDoi);

		Assertions.assertEquals(doi1, doi2);
	}
}
