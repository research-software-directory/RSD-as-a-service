// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
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
			scrapeCitations();
		} catch (RuntimeException | IOException e) {
			LOGGER.error("Exception while scraping citations", e);
			Utils.saveExceptionInDatabase("Citation scraper", null, null, e);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			LOGGER.warn("Got interrupted scraping citations, exiting");
			return;
		}

		long time = System.currentTimeMillis() - start;
		LOGGER.info("Done scraping citations ({} ms.)", time);
	}

	private static void scrapeCitations() throws IOException, InterruptedException {
		// Connect to the database to retrieve the reference papers to scrape
		String backendUrl = Config.backendBaseUrl();
		PostgrestCitationRepository localCitationRepository = new PostgrestCitationRepository(backendUrl);

		Collection<CitationData> referencePapersToScrape = localCitationRepository.leastRecentlyScrapedCitations(
			Config.maxCitationSourcesToScrape()
		);

		// already update the citations_scraped_at fields to prevent them being scraped by a second process if this one takes too long
		localCitationRepository.updateScrapedAtTime(
			referencePapersToScrape.stream().map(CitationData::id).toList(),
			Instant.now()
		);

		OpenAlexConnector openAlexConnector = new OpenAlexConnector();
		PostgrestMentionRepository localMentionRepository = new PostgrestMentionRepository(backendUrl);
		Instant now = Instant.now();

		for (CitationData citationData : referencePapersToScrape) {
			long t1 = System.currentTimeMillis();

			LOGGER.info("Scraping for DOI {}, OpenAlex ID {}", citationData.doi(), citationData.openalexId());

			Collection<ExternalMentionRecord> citingMentions;
			try {
				OpenalexId openalexId = citationData.openalexId();
				if (openalexId == null) {
					if (citationData.doi() == null) {
						continue;
					}

					Optional<OpenalexId> optionalOpenalexId = openAlexConnector.getOpenAlexIdFromDoi(
						citationData.doi()
					);
					if (optionalOpenalexId.isEmpty()) {
						continue;
					}

					openalexId = optionalOpenalexId.get();
				}
				citingMentions = openAlexConnector.citations(openalexId, citationData.id());
			} catch (RsdResponseException e) {
				LOGGER.error("Exception while scraping citations", e);
				Utils.saveExceptionInDatabase("Citation scraper", null, citationData.id(), e);
				continue;
			}
			// we don't update mentions that have a DOI in the database with OpenAlex data, as they can already be
			// scraped through Crossref or DataCite

			long t2 = System.currentTimeMillis();

			citingMentions.removeIf(
				mention -> mention.doi() != null && citationData.knownDois().contains(mention.doi())
			);
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

			localCitationRepository.saveCitations(backendUrl, citationData.id(), citingMentionIds);

			long t4 = System.currentTimeMillis();

			LOGGER.info(
				"Scraping for {} done. OpenAlex: {} ms. Saving mentions {} ms. Saving citations {} ms. Total {} ms.",
				citationData.doi(),
				(t2 - t1),
				(t3 - t2),
				(t4 - t3),
				(t4 - t1)
			);
		}
	}
}
