// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/*
 * 1. Get the least recently scraped releases from software with a concept DOI. We also check for existing releases that already exist as a mention in the database, so we don't have to (TODO) recreate them later.
 * 2. For each release check if it's a concept DOI on DataCite and get all the versioned DOIs.
 * 3. For each versioned DOI, get its metadata from DataCite. If this versioned DOI did not exist as a mention, create it using the mention scraper. Add each versioned DOI as an entry in the release_content table
 */
public class MainReleases {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainReleases.class);

	public static void main(String[] args) {

		LOGGER.info("Start scraping releases");

		long t1 = System.currentTimeMillis();

		PostgrestReleaseRepository releaseRepository = new PostgrestReleaseRepository(Config.backendBaseUrl());

		Collection<ReleaseData> releasesToScrape = releaseRepository.leastRecentlyScrapedReleases(Config.maxRequestsDoi());

		Collection<Doi> conceptDoisToScrape = releasesToScrape.stream()
				.map(releaseData -> releaseData.conceptDoi)
				.toList();

		Map<Doi, Collection<ExternalMentionRecord>> scrapedReleasesPerConceptDoi = new DataCiteReleaseRepository().getVersionedDois(conceptDoisToScrape);

		Instant now = Instant.now();
		PostgrestMentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<ExternalMentionRecord> allMentions = scrapedReleasesPerConceptDoi.values().stream()
				.flatMap(Collection::stream)
				.toList();
		Map<Doi, UUID> doiToId = new HashMap<>();
		for (ExternalMentionRecord mention : allMentions) {
			try {
				RsdMentionIds ids = localMentionRepository.createMentionIfNotExistsOnDoiAndGetIds(mention, now);
				doiToId.put(mention.doi(), ids.id());
			} catch (Exception e) {
				LOGGER.error("Unable to save mention with DOI {}", mention.doi());
				Utils.saveExceptionInDatabase("Releases scraper", "mention", null, e);
			}
		}

		releaseRepository.saveReleaseContent(releasesToScrape, scrapedReleasesPerConceptDoi, doiToId);

		long time = System.currentTimeMillis() - t1;
		LOGGER.info("Done scraping releases ({} ms.)", time);
	}
}
