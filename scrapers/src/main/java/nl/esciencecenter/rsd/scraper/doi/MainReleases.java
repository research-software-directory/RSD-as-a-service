// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Config;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

/*
 * 1. Get the least recently scraped releases from software with a concept DOI. We also check for existing releases that already exist as a mention in the database, so we don't have to (TODO) recreate them later.
 * 2. For each release check if it's a concept DOI on DataCite and get all the versioned DOIs.
 * 3. For each versioned DOI, get its metadata from DataCite. If this versioned DOI did not exist as a mention, create it using the mention scraper. Add each versioned DOI as an entry in the release_content table
 */
public class MainReleases {

	public static void main(String[] args) {
		System.out.println("Start scraping releases");
		PostgrestReleaseRepository releaseRepository = new PostgrestReleaseRepository(Config.backendBaseUrl());

		Collection<ReleaseData> releasesToScrape = releaseRepository.leastRecentlyScrapedReleases(Config.maxRequestsDoi());

		Collection<String> conceptDoisToScrape = releasesToScrape.stream()
				.map(releaseData -> releaseData.conceptDoi)
				.toList();

		Map<String, Collection<MentionRecord>> scrapedReleasesPerConceptDoi = new DataCiteReleaseRepository().getVersionedDois(conceptDoisToScrape);

		MentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<MentionRecord> allMentions = scrapedReleasesPerConceptDoi.values().stream()
				.flatMap(Collection::stream)
				.toList();
		Map<String, UUID> doiToId = localMentionRepository.save(allMentions);

		releaseRepository.saveReleaseContent(releasesToScrape, scrapedReleasesPerConceptDoi, doiToId);
		System.out.println("Done scraping releases");
	}
}
