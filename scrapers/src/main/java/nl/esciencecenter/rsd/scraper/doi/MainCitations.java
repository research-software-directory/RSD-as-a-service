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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * Main entry point for citation scraper. 
 */
public class MainCitations {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MainCitations.class);
	
	public static void main(String[] args) {
		
		LOGGER.info("Start scraping citations");

		long start = System.currentTimeMillis();

		try {
			// Connect to the database to retrieve the 
			
			String backendUrl = Config.backendBaseUrl();
			PostgrestCitationRepository localCitationRepository = new PostgrestCitationRepository(backendUrl);

			Collection<CitationData> referencePapersToScrape = localCitationRepository.leastRecentlyScrapedCitations(5);
			OpenAlexCitations openAlexCitations = new OpenAlexCitations();
			MentionRepository localMentionRepository = new PostgrestMentionRepository(backendUrl);
			String email = Config.crossrefContactEmail().orElse(null);
			ZonedDateTime now = ZonedDateTime.now();

			for (CitationData citationData : referencePapersToScrape) {

				long t1 = System.currentTimeMillis();

				LOGGER.info("Scraping for {}", citationData.doi);

				Collection<MentionRecord> citingMentions = openAlexCitations.citations(citationData.doi, email, citationData.id);
				// we don't update mentions that have a DOI in the database with OpenAlex data, as they can already be
				// scraped through Crossref of DataCite

				long t2 = System.currentTimeMillis();

				citingMentions.removeIf(mention -> mention.doi != null && citationData.knownDois.contains(mention.doi));
				localMentionRepository.save(citingMentions);

				Collection<UUID> citingMentionIds = new ArrayList<>();
				for (MentionRecord citingMention : citingMentions) {
					citingMentionIds.add(citingMention.id);
				}

				long t3 = System.currentTimeMillis();

				localCitationRepository.saveCitations(backendUrl, citationData.id, citingMentionIds, now);

				long t4 = System.currentTimeMillis();

				LOGGER.info("Scraping for {} done. OpenAlex: {} ms. Saving mentions {} ms. Saving citations {} ms. Total {} ms.", citationData.doi, (t2-t1), (t3-t2), (t4-t3), (t4-t1));				
			}

		} catch (Exception e) {
			Utils.saveExceptionInDatabase("Citation scraper", null, null, e);
		}

		long time = System.currentTimeMillis() - start;

		LOGGER.info("Done scraping citations ({} ms.)", time);
	}
}
