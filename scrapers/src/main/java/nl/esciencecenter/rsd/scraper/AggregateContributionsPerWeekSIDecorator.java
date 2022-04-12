package nl.esciencecenter.rsd.scraper;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.SortedMap;
import java.util.TreeMap;

public class AggregateContributionsPerWeekSIDecorator implements SoftwareInfo {

	private final SoftwareInfo origin;

	public AggregateContributionsPerWeekSIDecorator(SoftwareInfo origin) {
		this.origin = Objects.requireNonNull(origin);
	}

	@Override
	public String languages() {
		return origin.languages();
	}

	@Override
	public String license() {
		return origin.license();
	}

	@Override
	public String contributions() {
		JsonArray commitsPerContributor = JsonParser.parseString(origin.contributions()).getAsJsonArray();
		SortedMap<Long, Long> commitsPerWeek = new TreeMap<>();
		for (JsonElement jsonElement : commitsPerContributor) {
			JsonArray weeks = jsonElement.getAsJsonObject().getAsJsonArray("weeks");
			for (JsonElement week : weeks) {
				long weekTimestamp = week.getAsJsonObject().getAsJsonPrimitive("w").getAsLong();
				long commitsInWeek = week.getAsJsonObject().getAsJsonPrimitive("c").getAsLong();
				long countedCommits = commitsPerWeek.getOrDefault(weekTimestamp, 0L);
				commitsPerWeek.put(weekTimestamp, commitsInWeek + countedCommits);
			}
		}
		return new Gson().toJson(commitsPerWeek);
	}

	/**
	 * Aggregate contributions from repository. Returns a JSON as a String, with the following content:
	 * {
	 *     timestamp: number_of_commits,
	 *     ....
	 * }
	 * The timestamp represents the beginning of the week (Sunday, 00:00:00 UTC).
	 * @return A String representing JSON
	 */
	public String contributionsGitLab() {
		JsonArray allCommits = JsonParser.parseString(origin.contributions()).getAsJsonArray();
		String oldestCommit = allCommits.get(allCommits.size() - 1).getAsJsonObject().get("committed_date").getAsString();
		ZonedDateTime oldestCommitDate = ZonedDateTime.parse(oldestCommit).withZoneSameInstant(ZoneOffset.UTC);
		ZonedDateTime firstAggregationWeek = oldestCommitDate.minusDays(oldestCommitDate.getDayOfWeek().getValue()).withHour(0).withMinute(0).withSecond(0).withNano(0);
		ZonedDateTime lastAggregationWeek = ZonedDateTime.now(ZoneOffset.UTC).minusDays(ZonedDateTime.now().getDayOfWeek().getValue()).withHour(0).withMinute(0).withSecond(0).withNano(0);
		long oneWeekInSeconds = 604800L; // 60*60*24*7
		// create empty map
		SortedMap<Long, Long> commitsPerWeek = new TreeMap<>();
		long currentSeconds = firstAggregationWeek.toEpochSecond();
		while (currentSeconds < lastAggregationWeek.toEpochSecond() + oneWeekInSeconds) {
			commitsPerWeek.put(currentSeconds, 0L);
			currentSeconds += oneWeekInSeconds;
		}
		// Fill map
		for (int i = allCommits.size() - 1; i >= 0; i--) {
			JsonObject currentCommit = allCommits.get(i).getAsJsonObject();
			ZonedDateTime commitDateUTC = ZonedDateTime.parse(currentCommit.get("committed_date").getAsString()).withZoneSameInstant(ZoneOffset.UTC);
			ZonedDateTime commitWeek = commitDateUTC.minusDays(commitDateUTC.getDayOfWeek().getValue()).withHour(0).withHour(0).withMinute(0).withSecond(0).withNano(0);
			Long commitWeekSeconds = commitWeek.toEpochSecond();
			Long newCommitsThisWeek;
			try {
				newCommitsThisWeek = commitsPerWeek.get(commitWeekSeconds) + 1L;
				commitsPerWeek.put(commitWeekSeconds, newCommitsThisWeek);
			} catch (Exception e) {
				System.out.println("An error occurred assigning commits to a week.");
				e.printStackTrace();
			}
		}
		return new Gson().toJson(commitsPerWeek);
	}
}
