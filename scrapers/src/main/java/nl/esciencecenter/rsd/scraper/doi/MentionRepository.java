package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;

public interface MentionRepository {

	Collection<MentionRecord> leastRecentlyScrapedMentions(int limit);

	Collection<MentionRecord> mentionData(Collection<String> dois);

	void save(Collection<MentionRecord> mentions);
}
