package nl.esciencecenter.rsd.scraper.doi;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.List;

public class DataciteMentionRepositoryTest {

	@Test
	public void givenCollectionOfStrings_whenJoining_thenCorrectStringReturned() {
		Collection<String> strings = List.of("abc", "def", "ghij");

		String joinedString = DataciteMentionRepository.joinCollection(strings);

		Assertions.assertEquals("\"abc\",\"def\",\"ghij\"", joinedString);
	}
}
