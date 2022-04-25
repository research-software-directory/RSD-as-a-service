package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.Month;
import java.util.Collection;

public class PostgrestSIRTest {

	@Test
	void givenEmptyJsonArray_whenParsingJsonData_thenEmptyCollectionReturned() {
		String emptyArrayJson = "[]";
		PostgrestSIR postgrestSIR = new PostgrestSIR("", CodePlatformProvider.GITHUB);

		Collection<RepositoryUrlData> result = postgrestSIR.parseJsonData(emptyArrayJson);

		Assertions.assertTrue(result.isEmpty());
	}

	@Test
	void givenValidJson_whenParsingJsonData_thenRecordWithDataReturned() {
		String arrayWithSingleValidObjectJson = """
				[
					{
						"software": "Test software",
						"url": "https://www.example.com",
						"license": "My license",
						"license_scraped_at": "2022-04-25T14:48:02.911546",
						"commit_history": "Commit history",
						"commit_history_scraped_at": "2022-04-25T14:48:02.911546",
						"languages": "Java, JavaScript",
						"languages_scraped_at": "2022-04-25T14:48:02.911546"
					}
				]""";
		PostgrestSIR postgrestSIR = new PostgrestSIR("", CodePlatformProvider.GITHUB);

		Collection<RepositoryUrlData> result = postgrestSIR.parseJsonData(arrayWithSingleValidObjectJson);

		Assertions.assertEquals(1, result.size());
		RepositoryUrlData dataToInspect = result.stream().findFirst().get();
		Assertions.assertEquals("Test software", dataToInspect.software());
		Assertions.assertEquals("https://www.example.com", dataToInspect.url());
		Assertions.assertEquals(CodePlatformProvider.GITHUB, dataToInspect.code_platform());
		Assertions.assertEquals("My license", dataToInspect.license());
		Assertions.assertEquals(Month.APRIL, dataToInspect.licenseScrapedAt().getMonth());
		Assertions.assertEquals("Commit history", dataToInspect.commitHistory());
		Assertions.assertEquals(2022, dataToInspect.commitHistoryScrapedAt().getYear());
		Assertions.assertEquals("Java, JavaScript", dataToInspect.languages());
		Assertions.assertEquals(25, dataToInspect.languagesScrapedAt().getDayOfMonth());
	}

	@Test
	void givenValidJsonWithNullData_whenParsingJsonData_thenRecordReturnedWithNulls() {
		String arrayWithValidDataAndNullsJson = """
				[
					{
						"software": "Test software",
						"url": "https://www.example.com",
						"license": "My license",
						"license_scraped_at": "2022-04-25T14:48:02.911546",
						"commit_history": "Commit history",
						"commit_history_scraped_at": null,
						"languages": null,
						"languages_scraped_at": "2022-04-25T14:48:02.911546"
					}
				]""";
		PostgrestSIR postgrestSIR = new PostgrestSIR("", CodePlatformProvider.GITHUB);

		Collection<RepositoryUrlData> result = postgrestSIR.parseJsonData(arrayWithValidDataAndNullsJson);

		Assertions.assertEquals(1, result.size());
		RepositoryUrlData dataToInspect = result.stream().findFirst().get();
		Assertions.assertEquals("Test software", dataToInspect.software());
		Assertions.assertEquals("https://www.example.com", dataToInspect.url());
		Assertions.assertEquals(CodePlatformProvider.GITHUB, dataToInspect.code_platform());
		Assertions.assertEquals("My license", dataToInspect.license());
		Assertions.assertEquals(Month.APRIL, dataToInspect.licenseScrapedAt().getMonth());
		Assertions.assertEquals("Commit history", dataToInspect.commitHistory());
		Assertions.assertNull(dataToInspect.commitHistoryScrapedAt());
		Assertions.assertNull(dataToInspect.languages());
		Assertions.assertEquals(25, dataToInspect.languagesScrapedAt().getDayOfMonth());
	}

	@Test
	void givenInvalidJson_whenParsingJsonData_thenExceptionThrown() {
//		missing comma after null from languages
		String invalidJson = """
				[
					{
						"software": "Test software",
						"url": "https://www.example.com",
						"license": "My license",
						"license_scraped_at": "2022-04-25T14:48:02.911546",
						"commit_history": "Commit history",
						"commit_history_scraped_at": null,
						"languages" null
						"languages_scraped_at": "2022-04-25T14:48:02.911546"
					}
				]""";
		PostgrestSIR postgrestSIR = new PostgrestSIR("", CodePlatformProvider.GITHUB);

		Assertions.assertThrows(RuntimeException.class, () -> postgrestSIR.parseJsonData(invalidJson));
	}

	@Test
	void givenValidJsonWithMissingFields_whenParsingJsonData_thenExceptionThrown() {
		String missingLicenseJson = """
				[
					{
						"software": "Test software",
						"url": "https://www.example.com",
						"license_scraped_at": "2022-04-25T14:48:02.911546",
						"commit_history": "Commit history",
						"commit_history_scraped_at": null,
						"languages" null,
						"languages_scraped_at": "2022-04-25T14:48:02.911546"
					}
				]""";
		PostgrestSIR postgrestSIR = new PostgrestSIR("", CodePlatformProvider.GITHUB);

		Assertions.assertThrows(RuntimeException.class, () -> postgrestSIR.parseJsonData(missingLicenseJson));
	}
}
