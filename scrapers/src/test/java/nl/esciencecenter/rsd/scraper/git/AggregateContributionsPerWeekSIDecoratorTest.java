package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.git.AggregateContributionsPerWeekSIDecorator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AggregateContributionsPerWeekSIDecoratorTest {

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
