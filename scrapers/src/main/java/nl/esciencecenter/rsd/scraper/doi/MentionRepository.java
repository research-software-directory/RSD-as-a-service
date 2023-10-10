// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;

public interface MentionRepository {

	Collection<MentionRecord> leastRecentlyScrapedMentions(int limit);

	Collection<MentionRecord> mentionData(Collection<String> dois);

	void save(Collection<MentionRecord> mentions);
}
