// SPDX-FileCopyrightText: 2023 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * 1. Get the least recently scraped releases from software with a concept DOI. We also check for existing releases that already exist as a mention in the database, so we don't have to re-harvest them later.
 * 2. For each release get all the versioned DOIs.
 * 3. For each versioned DOI, get its metadata from DataCite. If this versioned DOI did not exist as a mention, create it using the mention harvester. Add each versioned DOI as an entry in the release_content table
 */
public class MainReleases {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainReleases.class);
	private static final String SERVICE_NAME = "Releases harvester";
	private static final String TABLE_NAME = "software";

	static void main() {
		LOGGER.info("Start harvesting releases");

		Instant tic = Instant.now();

		try {
			harvestReleases();
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase(SERVICE_NAME, TABLE_NAME, null, e);
		}

		Instant toc = Instant.now();
		LOGGER.info("Done harvesting releases ({} ms.)", Duration.between(tic, toc).toMillis());
	}

	private static void harvestReleases() {
		PostgrestReleaseRepository releaseRepository = new PostgrestReleaseRepository(Config.backendBaseUrl());

		Collection<ReleaseData> releasesToHarvest = releaseRepository.leastRecentlyScrapedReleases(
			Config.maxRequestsDoi()
		);

		Collection<Doi> conceptDoisToScrape = releasesToHarvest
			.stream()
			.map(releaseData -> releaseData.conceptDoi)
			.toList();
		Map<Doi, UUID> conceptIdToDatabaseId = releasesToHarvest
			.stream()
			.collect(Collectors.toMap(entry -> entry.conceptDoi, entry -> entry.softwareId));
		Map<Doi, Collection<Doi>> conceptIdToExistingReleases = releasesToHarvest
			.stream()
			.collect(Collectors.toMap(entry -> entry.conceptDoi, entry -> entry.versionedDois));

		DataciteConnector dataciteConnector = Config.crossrefContactEmail()
			.map(DataciteConnector::new)
			.orElseGet(DataciteConnector::new);

		Collection<Future<?>> harvestVersionDoiTasks = new ConcurrentLinkedQueue<>();
		ConcurrentMap<Doi, Collection<ExternalMentionRecord>> scrapedReleasesPerConceptDoi = new ConcurrentHashMap<>();
		try (ExecutorService threadPool = Executors.newFixedThreadPool(20)) {
			for (Doi conceptDoi : conceptDoisToScrape) {
				Runnable harvestVersionDoisTask = () -> {
					Collection<Doi> versionDois;
					try {
						versionDois = dataciteConnector.harvestVersionedDois(conceptDoi);
					} catch (Exception e) {
						Utils.saveExceptionInDatabase(
							SERVICE_NAME,
							TABLE_NAME,
							conceptIdToDatabaseId.get(conceptDoi),
							e
						);
						if (e instanceof InterruptedException) {
							Thread.currentThread().interrupt();
						}
						return;
					}

					for (Doi versionDoi : versionDois) {
						if (conceptIdToExistingReleases.get(conceptDoi).contains(versionDoi)) {
							continue;
						}

						Runnable harvestMentionTask = () -> {
							ExternalMentionRecord harvestedMention;
							try {
								harvestedMention = dataciteConnector.harvestMention(versionDoi);
							} catch (Exception e) {
								Utils.saveExceptionInDatabase(
									SERVICE_NAME,
									TABLE_NAME,
									conceptIdToDatabaseId.get(conceptDoi),
									e
								);
								if (e instanceof InterruptedException) {
									Thread.currentThread().interrupt();
								}
								return;
							}

							Collection<ExternalMentionRecord> harvestedMentions =
								scrapedReleasesPerConceptDoi.computeIfAbsent(conceptDoi, _ ->
									new ConcurrentLinkedQueue<>()
								);
							harvestedMentions.add(harvestedMention);
						};

						threadPool.submit(harvestMentionTask);
					}
				};

				harvestVersionDoiTasks.add(threadPool.submit(harvestVersionDoisTask));
			}

			for (Future<?> future : harvestVersionDoiTasks) {
				try {
					future.get();
				} catch (Exception e) {
					Utils.saveExceptionInDatabase(SERVICE_NAME, TABLE_NAME, null, e);
					if (e instanceof InterruptedException) {
						Thread.currentThread().interrupt();
						return;
					}
				}
			}
		}

		Instant harvestTime = Instant.now();
		PostgrestMentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<ExternalMentionRecord> allMentions = scrapedReleasesPerConceptDoi
			.values()
			.stream()
			.flatMap(Collection::stream)
			.toList();
		Map<Doi, UUID> doiToId = new HashMap<>();
		for (ExternalMentionRecord mention : allMentions) {
			try {
				RsdMentionIds ids = localMentionRepository.createMentionIfNotExistsOnDoiAndGetIds(mention, harvestTime);
				doiToId.put(mention.doi(), ids.id());
			} catch (Exception e) {
				LOGGER.error("Unable to save mention with DOI {}", mention.doi());
				Utils.saveExceptionInDatabase(SERVICE_NAME, TABLE_NAME, null, e);
			}
		}

		releaseRepository.saveReleaseContent(releasesToHarvest, scrapedReleasesPerConceptDoi, doiToId);
	}
}
