package nl.esciencecenter.rsd.scraper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;


public class GitLabSITest {
	private final String baseApiUrl = "https://git.gfz-potsdam.de/api";
	private final String repo = "swc-bb/swc-templates/swc-l/python";
	private final GitLabSI scraper = new GitLabSI(baseApiUrl, repo);

	@Disabled
	@Test
	void languages() {
		final String languages = scraper.languages();
		Assertions.assertTrue(languages.startsWith("{"));
		Assertions.assertTrue(languages.endsWith("}"));
		Assertions.assertTrue(languages.contains("Python"));
	}

	@Disabled
	@Test
	void license() {
		Assertions.assertEquals("MIT License", scraper.license());
	}

	@Disabled
	@Test
	void licenseDoesNotExist() {
		// unlicensed projects should return null
		// we need to find a suitable project or create a mocked interface
		Assertions.assertEquals(null, scraper.license());
	}

	@Disabled
	@Test
	void contributions() {
		final String contributions = scraper.contributions();
		Assertions.assertTrue(contributions.contains("360071ec98b3c0d38ac8e7f0abacc05098c90311"));
		Assertions.assertTrue(contributions.contains("2019-10-24T16:40:44.000+02:00"));
	}
}
