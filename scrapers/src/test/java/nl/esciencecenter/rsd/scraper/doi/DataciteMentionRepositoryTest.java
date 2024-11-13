// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.List;

class DataciteMentionRepositoryTest {

	@Test
	void givenCollectionOfStrings_whenJoining_thenCorrectStringReturned() {
		Doi doi1 = Doi.fromString("10.000/1");
		Doi doi2 = Doi.fromString("10.2/2");
		Doi doi3 = Doi.fromString("10.3/abc-def");
		Collection<Doi> strings = List.of(doi1, doi2, doi3);

		String joinedString = DataciteMentionRepository.joinDoisForGraphqlQuery(strings);

		String expected = "\"%s\",\"%s\",\"%s\"".formatted(doi1, doi2, doi3);
		Assertions.assertEquals(expected, joinedString);
	}
}
