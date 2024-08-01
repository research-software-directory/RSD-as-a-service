// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.UUID;

class PostgrestConnectorTest {

	@Test
	void givenEmptyJsonArray_whenParsingJsonData_thenEmptyCollectionReturned() {
		String emptyArrayJson = "[]";

		Collection<BasicRepositoryData> result = PostgrestConnector.parseBasicJsonData(emptyArrayJson);

		Assertions.assertTrue(result.isEmpty());
	}

	@Test
	void givenValidJson_whenParsingJsonData_thenRecordWithDataReturned() {
		String arrayWithSingleValidObjectJson = """
			[
				{
					"software": "3a07a021-743e-4adf-a2d9-3c85075fe9cf",
					"url": "https://www.example.com"
				}
			]""";

		Collection<BasicRepositoryData> result = PostgrestConnector.parseBasicJsonData(arrayWithSingleValidObjectJson);

		Assertions.assertEquals(1, result.size());
		BasicRepositoryData dataToInspect = result.stream().findFirst().get();
		Assertions.assertEquals(UUID.fromString("3a07a021-743e-4adf-a2d9-3c85075fe9cf"), dataToInspect.software());
		Assertions.assertEquals("https://www.example.com", dataToInspect.url());
	}

	@Test
	void givenJsonWithInvalidUuid_whenParsingJsonData_thenExceptionThrown() {
		String invalidUuidJson = """
			[
				{
					"software": "not-a-UUID",
					"url": "https://www.example.com"
				}
			]""";

		Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> PostgrestConnector.parseBasicJsonData(invalidUuidJson));
	}

	@Test
	void givenInvalidJson_whenParsingJsonData_thenExceptionThrown() {
//		missing comma after software UUID
		String invalidJson = """
			[
				{
					"software": "3a07a021-743e-4adf-a2d9-3c85075fe9cf"
					"url": "https://www.example.com"
				}
			]""";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestConnector.parseBasicJsonData(invalidJson));
	}

	@Test
	void givenValidJsonWithMissingFields_whenParsingJsonData_thenExceptionThrown() {
		String missingSoftwareJson = """
			[
				{
					"url": "https://www.example.com"
				}
			]""";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestConnector.parseBasicJsonData(missingSoftwareJson));

		String missingUrlJson = """
			[
				{
					"software": "3a07a021-743e-4adf-a2d9-3c85075fe9cf"
				}
			]""";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestConnector.parseBasicJsonData(missingUrlJson));
	}

	@Test
	void givenValidJsonWithNullFields_whenParsingJsonData_thenExceptionThrown() {
		String nullSoftwareJson = """
			[
				{
					"software": null,
					"url": "https://www.example.com"
				}
			]""";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestConnector.parseBasicJsonData(nullSoftwareJson));

		String nullUrlJson = """
			[
				{
					"software": "3a07a021-743e-4adf-a2d9-3c85075fe9cf",
					"url": null
				}
			]""";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestConnector.parseBasicJsonData(nullUrlJson));
	}
}
