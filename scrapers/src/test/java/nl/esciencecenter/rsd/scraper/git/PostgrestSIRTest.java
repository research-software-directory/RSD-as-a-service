// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

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

	@Test
	void givenEmptyCollection_whenMarshallingToJson_thenEmptyArrayJsonReturned() {
		Collection<RepositoryUrlData> emptyCollection = Collections.EMPTY_LIST;

		String json = PostgrestSIR.repositoryUrlDataToJson(emptyCollection);

		JsonArray emptyArray = JsonParser.parseString(json).getAsJsonArray();
		Assertions.assertTrue(emptyArray.isEmpty());
	}

	@Test
	void givenCollectionWithOneEntry_whenMarshallingToJson_thenCorrectJsonStringReturned() {
		Collection<RepositoryUrlData> collectionWithOneEntry = new ArrayList<>();
		RepositoryUrlData entry = new RepositoryUrlData("My software", "https://www.example.com", CodePlatformProvider.GITHUB,
				"My license", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Commit history", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Java, JavaScript", LocalDateTime.parse("2022-04-25T14:48:02.911546"));
		collectionWithOneEntry.add(entry);

		String json = PostgrestSIR.repositoryUrlDataToJson(collectionWithOneEntry);

		JsonArray arrayWithOneEntry = JsonParser.parseString(json).getAsJsonArray();
		Assertions.assertEquals(1, arrayWithOneEntry.size());

		JsonObject entryJson = arrayWithOneEntry.get(0).getAsJsonObject();
		Assertions.assertEquals("My software", entryJson.getAsJsonPrimitive("software").getAsString());
		Assertions.assertEquals("https://www.example.com", entryJson.getAsJsonPrimitive("url").getAsString());
		Assertions.assertEquals("github", entryJson.getAsJsonPrimitive("code_platform").getAsString());
		Assertions.assertEquals("My license", entryJson.getAsJsonPrimitive("license").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("license_scraped_at").getAsString());
		Assertions.assertEquals("Commit history", entryJson.getAsJsonPrimitive("commit_history").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("commit_history_scraped_at").getAsString());
		Assertions.assertEquals("Java, JavaScript", entryJson.getAsJsonPrimitive("languages").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("languages_scraped_at").getAsString());
	}

	@Test
	void givenCollectionWithOneEntryWithNulls_whenMarshallingToJson_thenCorrectJsonStringReturned() {
		Collection<RepositoryUrlData> collectionWithOneEntry = new ArrayList<>();
		RepositoryUrlData entry = new RepositoryUrlData("My software", "https://www.example.com", CodePlatformProvider.GITHUB,
				"My license", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				null, LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Java, JavaScript", null);
		collectionWithOneEntry.add(entry);

		String json = PostgrestSIR.repositoryUrlDataToJson(collectionWithOneEntry);

		JsonArray arrayWithOneEntry = JsonParser.parseString(json).getAsJsonArray();
		Assertions.assertEquals(1, arrayWithOneEntry.size());

		JsonObject entryJson = arrayWithOneEntry.get(0).getAsJsonObject();
		Assertions.assertEquals("My software", entryJson.getAsJsonPrimitive("software").getAsString());
		Assertions.assertEquals("https://www.example.com", entryJson.getAsJsonPrimitive("url").getAsString());
		Assertions.assertEquals("github", entryJson.getAsJsonPrimitive("code_platform").getAsString());
		Assertions.assertEquals("My license", entryJson.getAsJsonPrimitive("license").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("license_scraped_at").getAsString());
		Assertions.assertTrue(entryJson.get("commit_history").isJsonNull());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("commit_history_scraped_at").getAsString());
		Assertions.assertEquals("Java, JavaScript", entryJson.getAsJsonPrimitive("languages").getAsString());
		Assertions.assertTrue(entryJson.get("languages_scraped_at").isJsonNull());
	}

	@Test
	void givenCollectionWithTwoEntries_whenMarshallingToJson_thenCorrectJsonStringReturned() {
		Collection<RepositoryUrlData> collectionWithOneEntry = new ArrayList<>();
		RepositoryUrlData entry1 = new RepositoryUrlData("My software", "https://www.example.com", CodePlatformProvider.GITHUB,
				"My license", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				null, LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Java, JavaScript", null);
		RepositoryUrlData entry2 = new RepositoryUrlData("My software 2", "https://www.example.com", CodePlatformProvider.GITHUB,
				"My license", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Commit history", LocalDateTime.parse("2022-04-25T14:48:02.911546"),
				"Java, JavaScript", LocalDateTime.parse("2022-04-25T14:48:02.911546"));
		collectionWithOneEntry.add(entry1);
		collectionWithOneEntry.add(entry2);

		String json = PostgrestSIR.repositoryUrlDataToJson(collectionWithOneEntry);

		JsonArray arrayWithOneEntry = JsonParser.parseString(json).getAsJsonArray();
		Assertions.assertEquals(2, arrayWithOneEntry.size());

		JsonObject entryJson = arrayWithOneEntry.get(0).getAsJsonObject();
		Assertions.assertEquals("My software", entryJson.getAsJsonPrimitive("software").getAsString());
		Assertions.assertEquals("https://www.example.com", entryJson.getAsJsonPrimitive("url").getAsString());
		Assertions.assertEquals("github", entryJson.getAsJsonPrimitive("code_platform").getAsString());
		Assertions.assertEquals("My license", entryJson.getAsJsonPrimitive("license").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("license_scraped_at").getAsString());
		Assertions.assertTrue(entryJson.get("commit_history").isJsonNull());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson.getAsJsonPrimitive("commit_history_scraped_at").getAsString());
		Assertions.assertEquals("Java, JavaScript", entryJson.getAsJsonPrimitive("languages").getAsString());
		Assertions.assertTrue(entryJson.get("languages_scraped_at").isJsonNull());
		JsonObject entryJson2 = arrayWithOneEntry.get(1).getAsJsonObject();
		Assertions.assertEquals("My software 2", entryJson2.getAsJsonPrimitive("software").getAsString());
		Assertions.assertEquals("https://www.example.com", entryJson2.getAsJsonPrimitive("url").getAsString());
		Assertions.assertEquals("github", entryJson2.getAsJsonPrimitive("code_platform").getAsString());
		Assertions.assertEquals("My license", entryJson2.getAsJsonPrimitive("license").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson2.getAsJsonPrimitive("license_scraped_at").getAsString());
		Assertions.assertEquals("Commit history", entryJson2.getAsJsonPrimitive("commit_history").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson2.getAsJsonPrimitive("commit_history_scraped_at").getAsString());
		Assertions.assertEquals("Java, JavaScript", entryJson2.getAsJsonPrimitive("languages").getAsString());
		Assertions.assertEquals("2022-04-25T14:48:02.911546", entryJson2.getAsJsonPrimitive("languages_scraped_at").getAsString());
	}
}
