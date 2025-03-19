// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.net.URI;

class RorIdTest {

	@ParameterizedTest
	@ValueSource(strings = {
		"https://ror.org/14tsk2644", // ID should start with 0
		"https://ror.org/0ltsk2644", // character 'l' not allowed
		"https://ror.org/04tsk26444", // ID longer than 9 characters
		"https://ror.org/04tsk264", // // ID shorter than 9 characters
		"ror.org/04tsk2644", // should start with https://
		"",
	})
	void givenInvalidRorIds_whenTesting_thenFalseReturned(String url) {
		Assertions.assertFalse(RorId.isValidRorUrl(url));
	}

	@ParameterizedTest
	@ValueSource(strings = {
		"https://ror.org/14tsk2644", // ID should start with 0
		"https://ror.org/0ltsk2644", // character 'l' not allowed
		"https://ror.org/04tsk26444", // ID longer than 9 characters
		"https://ror.org/04tsk264", // // ID shorter than 9 characters
		"ror.org/04tsk2644", // should start with https://
		"",
	})
	void givenInvalidRorIds_whenCreatingInstance_thenExceptionThrown(String url) {
		Assertions.assertThrows(IllegalArgumentException.class, () -> RorId.fromUrlString(url));
	}

	@ParameterizedTest
	@ValueSource(strings = {
		"https://ror.org/04tsk2644",
		"https://ror.org/05qghxh33",
		"https://ror.org/01e6qks80",
		"https://ror.org/00wjc7c48",
		"https://ror.org/01swzsf04",
		"https://ror.org/02jbv0t02",
		"https://ror.org/05grdyy37",
		"https://ror.org/05f950310",
		"https://ror.org/04ke6ht85",
		"https://ror.org/018dfmf50",
	})
	void givenValidRorIds_whenTesting_thenTrueReturned(String url) {
		Assertions.assertTrue(RorId.isValidRorUrl(url));
	}

	@ParameterizedTest
	@ValueSource(strings = {
		"https://ror.org/04tsk2644",
		"https://ror.org/05qghxh33",
		"https://ror.org/01e6qks80",
		"https://ror.org/00wjc7c48",
		"https://ror.org/01swzsf04",
		"https://ror.org/02jbv0t02",
		"https://ror.org/05grdyy37",
		"https://ror.org/05f950310",
		"https://ror.org/04ke6ht85",
		"https://ror.org/018dfmf50",
	})
	void givenValidRorIds_whenCreatingInstance_thenNoExceptionThrown(String url) {
		RorId rorId = Assertions.assertDoesNotThrow(() -> RorId.fromUrlString(url));
		Assertions.assertNotNull(rorId);
	}

	@Test
	void givenValidRorId_whenGettingUrls_thenCorrectUrlsReturned() {
		RorId rorId = RorId.fromUrlString("https://ror.org/04tsk2644");

		Assertions.assertEquals(URI.create("https://ror.org/04tsk2644"), rorId.asUrl());
		Assertions.assertEquals(URI.create("https://api.ror.org/v1/organizations/04tsk2644"), rorId.asApiV1Url());
	}
}
