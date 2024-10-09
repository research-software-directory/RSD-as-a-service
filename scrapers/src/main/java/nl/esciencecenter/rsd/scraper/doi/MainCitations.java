// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

/*
 * Main entry point for citation scraper.
 */
public class MainCitations {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainCitations.class);

	public static void main(String[] args) {

		LOGGER.info("Start scraping citations");

		long start = System.currentTimeMillis();

		try {
			// Connect to the database to retrieve the reference papers to scrape

			String backendUrl = Config.backendBaseUrl();
			PostgrestCitationRepository localCitationRepository = new PostgrestCitationRepository(backendUrl);

			Collection<CitationData> referencePapersToScrape = localCitationRepository.leastRecentlyScrapedCitations(5);
			OpenAlexConnector openAlexConnector = new OpenAlexConnector();
			PostgrestMentionRepository localMentionRepository = new PostgrestMentionRepository(backendUrl);
			String email = Config.crossrefContactEmail().orElse(null);
			Instant now = Instant.now();

			for (CitationData citationData : referencePapersToScrape) {

				long t1 = System.currentTimeMillis();

				LOGGER.info("Scraping for DOI {}, OpenAlex ID {}", citationData.doi(), citationData.openalexId());

				Collection<ExternalMentionRecord> citingMentions = openAlexConnector.citations(citationData.openalexId(), citationData.doi(), email, citationData.id());
				// we don't update mentions that have a DOI in the database with OpenAlex data, as they can already be
				// scraped through Crossref or DataCite

				long t2 = System.currentTimeMillis();

				citingMentions.removeIf(mention -> mention.doi() != null && citationData.knownDois().contains(mention.doi()));
				Collection<RsdMentionIds> savedIds = new ArrayList<>(citingMentions.size());
				for (ExternalMentionRecord citingMention : citingMentions) {
					try {
						RsdMentionIds ids = localMentionRepository.createOrUpdateMentionWithOpenalexId(citingMention, now);
						savedIds.add(ids);
					} catch (Exception e) {
						LOGGER.error("Unable to save exception with OpenAlex ID {}", citingMention.openalexId());
						Utils.saveExceptionInDatabase("Citation scraper", "mention", null, e);
					}
				}

				Collection<UUID> citingMentionIds = new ArrayList<>();
				for (RsdMentionIds ids : savedIds) {
					citingMentionIds.add(ids.id());
				}

				long t3 = System.currentTimeMillis();

				localCitationRepository.saveCitations(backendUrl, citationData.id(), citingMentionIds, now);

				long t4 = System.currentTimeMillis();

				LOGGER.info("Scraping for {} done. OpenAlex: {} ms. Saving mentions {} ms. Saving citations {} ms. Total {} ms.", citationData.doi(), (t2 - t1), (t3 - t2), (t4 - t3), (t4 - t1));
			}

		} catch (IOException | InterruptedException e) {
			Utils.saveExceptionInDatabase("Citation scraper", null, null, e);

			if (e instanceof InterruptedException) {
				Thread.currentThread().interrupt();
			}
		}

		long time = System.currentTimeMillis() - start;
		LOGGER.info("Done scraping citations ({} ms.)", time);
	}
}
