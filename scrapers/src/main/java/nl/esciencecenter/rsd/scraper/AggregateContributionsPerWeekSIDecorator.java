package nl.esciencecenter.rsd.scraper;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

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
}
