// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class UtilsTest {

	@ParameterizedTest
	@CsvSource(
		value = {
			"abc,abc",
			" abc,abc",
			" abc ,abc",
			" abc,abc",
			"a  bc,a bc",
			"a  b  c,a b c",
			"  a  b  c,a b c",
			"a    b,a b",
			"  a    b ,a b",
		},
		ignoreLeadingAndTrailingWhitespace = false
	)
	void givenString_whenSanitised_thenLeadingAndTrailingAndDuplicateSpacesRemoved(
		String input,
		String expectedOutput
	) {
		Assertions.assertEquals(expectedOutput, Utils.sanitiseWhitespace(input));
	}

	@Test
	void givenNull_whenSanitised_thenNullReturned() {
		Assertions.assertNull(Utils.sanitiseWhitespace(null));
	}

	@ParameterizedTest
	@CsvSource(
		value = {
			"abc,abc",
			" abc,abc",
			" abc ,abc",
			" abc,abc",
			"a  bc,a-bc",
			"a  b  c,a-b-c",
			"  a  b  c,a-b-c",
			"a    b,a-b",
			"  a    b ,a-b",
			"a_b,a-b",
			"a@b,a-b",
			"a!@#$%^&*()_b,a-b",
			"aBc D,abc-d",
		},
		ignoreLeadingAndTrailingWhitespace = false
	)
	void givenString_whenSlugifies_thenCorrectSlugReturned(String input, String expectedOutput) {
		Assertions.assertEquals(expectedOutput, Utils.slugify(input));
	}

	@Test
	void urlEncode() {
		Assertions.assertEquals("one%2Ftwo", Utils.urlEncode("one/two"));
	}

	@Test
	void testCreatePatchUri() {
		String baseUri = "http://localhost/api/v1";
		String tableName = "table_name";
		String primaryKey = "d8718d90-a3df-4714-864d-40786223e462";
		String primaryKeyName = "id";

		String expectedUri = "http://localhost/api/v1/table_name?id=eq.d8718d90-a3df-4714-864d-40786223e462";
		String actualUri = Utils.createPatchUri(baseUri, tableName, primaryKey, primaryKeyName);

		Assertions.assertEquals(expectedUri, actualUri);
	}
}
