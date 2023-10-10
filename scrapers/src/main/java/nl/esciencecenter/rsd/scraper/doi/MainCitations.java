// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

public class MainCitations {

	public static void main(String[] args) {
		System.out.println("Start scraping citations");
		try {
			String backendUrl = Config.backendBaseUrl();
			PostgrestCitationRepository localCitationRepository = new PostgrestCitationRepository(backendUrl);

			Collection<CitationData> doisToScrape = localCitationRepository.leastRecentlyScrapedCitations(5);
			OpenAlexCitations openAlexCitations = new OpenAlexCitations();
			MentionRepository localMentionRepository = new PostgrestMentionRepository(backendUrl);
			String email = Config.crossrefContactEmail().orElse(null);
			ZonedDateTime now = ZonedDateTime.now();

			for (CitationData citationData : doisToScrape) {
				Collection<MentionRecord> citingMentions = openAlexCitations.citations(citationData.doi, email);
				localMentionRepository.save(citingMentions);

				Collection<UUID> citingMentionIds = new ArrayList<>();
				for (MentionRecord citingMention : citingMentions) {
					citingMentionIds.add(citingMention.id);
				}

				localCitationRepository.saveCitations(backendUrl, citationData.id, citingMentionIds, now);
			}
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("Citation scraper", null, null, e);
		}

		System.out.println("Done scraping citations");
	}
}
