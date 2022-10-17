// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AggregateContributionsPerWeekSIDecoratorTest {
	private final String apiUrl = "https://api.github.com";
	private final String projectPath = "cmeessen/empty";

	@Test
	void emptyRepository() {
		// String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(new GithubSI(apiUrl, projectPath), CodePlatformProvider.GITHUB).contributions();
		String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(
			new GitLabSI("https://gitlab.hzdr.de/api", "christian.meessen/empty"),
			CodePlatformProvider.GITHUB
		).contributions();
	}

	@Test
	void givenGithubCommitData_whenAggregating_thenAggregatedDataReturned() {
		String commitDataJson = """
				[
					{
						"weeks": [
							{
								"c": 3,
								"w": 100
							},
							{
								"c": 4,
								"w": 200
							}
						]
					},
					{
						"weeks": [
							{
								"c": 5,
								"w": 100
							},
							{
								"c": 6,
								"w": 50
							}
						]
					},
					{
						"weeks": [
							{
								"c": 10,
								"w": 100
							}
						]
					}
				]
				""";

		String result = AggregateContributionsPerWeekSIDecorator.contributionsGitHub(commitDataJson);

		JsonObject resultAsObject = JsonParser.parseString(result).getAsJsonObject();
		Assertions.assertEquals(6, resultAsObject.getAsJsonPrimitive("50").getAsInt());
		Assertions.assertEquals(3 + 5 + 10, resultAsObject.getAsJsonPrimitive("100").getAsInt());
		Assertions.assertEquals(4, resultAsObject.getAsJsonPrimitive("200").getAsInt());
	}
}
