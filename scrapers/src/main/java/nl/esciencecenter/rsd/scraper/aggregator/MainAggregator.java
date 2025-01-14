// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.aggregator;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class MainAggregator {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainAggregator.class);
	private static final URI BASE_URL = URI.create(Config.backendBaseUrl());
	static final String REMOTE_SOFTWARE_TABLE_NAME = "remote_software";
	static final String AGGREGATOR_SERVICE_NAME = "Aggregator";


	public static void main(String[] args) {
		LOGGER.info("Start aggregating RSDs");
		long start = System.nanoTime();

		ZonedDateTime now = ZonedDateTime.now();
		Collection<RemoteRsdData> allRemoteEntries = PostgrestConnector.allActiveDomains(BASE_URL);

		Collection<RemoteRsdData> remoteEntriesToScrape = allRemoteEntries.stream()
			.filter(entry -> entry.refreshedAt() == null || entry.refreshedAt()
				.plus(entry.refreshInterval())
				// subtracting 10 seconds to take into account variations in when this scraper starts
				.minus(Duration.ofSeconds(10L))
				.isBefore(now))
			.toList();

		ConcurrentMap<UUID, JsonArray> softwarePerId = new ConcurrentHashMap<>(remoteEntriesToScrape.size());
		Collection<Callable<Void>> tasks = remoteEntriesToScrape.stream()
			.<Callable<Void>>map(entry -> () -> {
				JsonArray scrapedSoftware = RemoteRsdConnector.getAllSoftware(entry.domain());
				softwarePerId.put(entry.id(), scrapedSoftware);
				return null;
			})
			.toList();

		try (ExecutorService executorService = Executors.newFixedThreadPool(8)) {
			List<Future<Void>> completedFutures = executorService.invokeAll(tasks);
			for (Future<Void> completedFuture : completedFutures) {
				try {
					completedFuture.get();
				} catch (ExecutionException e) {
					LOGGER.error("Unknown error", e);
					Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, null, e);
				} catch (InterruptedException e) {
					Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, null, e);
					LOGGER.error("Got interrupted, early exiting aggregating RSDs", e);
					Thread.currentThread().interrupt();
					return;
				}
			}
		} catch (InterruptedException e) {
			Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, null, e);
			LOGGER.error("Got interrupted, early exiting aggregating RSDs", e);
			Thread.currentThread().interrupt();
			return;
		}

		JsonArray allSoftware = new JsonArray();
		for (Map.Entry<UUID, JsonArray> entry : softwarePerId.entrySet()) {
			JsonArray softwareArray = entry.getValue();
			UUID id = entry.getKey();
			for (JsonElement jsonElement : softwareArray) {
				JsonObject jsonObject = jsonElement.getAsJsonObject();
				jsonObject.addProperty("remote_rsd_id", id.toString());
				jsonObject.addProperty("remote_software_id", jsonObject.getAsJsonPrimitive("id").getAsString());
				jsonObject.remove("id");
				jsonObject
					.addProperty("scraped_at", now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

				allSoftware.add(jsonElement);
			}
		}

		PostgrestConnector.saveRemoteSoftware(BASE_URL, allSoftware);

		for (UUID id : softwarePerId.keySet()) {
			PostgrestConnector.updateRefreshedTimeAndErrorMessage(BASE_URL, id, now, null);
		}

		Map<UUID, Collection<UUID>> softwareScrapedPerRemoteId = new HashMap<>();
		for (JsonElement jsonElement : allSoftware) {
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			UUID remoteRsdId = UUID.fromString(jsonObject.getAsJsonPrimitive("remote_rsd_id").getAsString());
			UUID remoteSoftwareId = UUID.fromString(jsonObject.getAsJsonPrimitive("remote_software_id").getAsString());
			Collection<UUID> softwareOfRemote = softwareScrapedPerRemoteId.computeIfAbsent(remoteRsdId, id -> new HashSet<>());
			softwareOfRemote.add(remoteSoftwareId);
		}

		for (RemoteRsdData remoteRsdData : remoteEntriesToScrape) {
			UUID remoteId = remoteRsdData.id();
			if (!softwareScrapedPerRemoteId.containsKey(remoteId)) {
				continue;
			}

			Collection<UUID> scrapedSoftware = softwareScrapedPerRemoteId.get(remoteId);
			Collection<UUID> previouslyStoredSoftwareIds = remoteRsdData.softwareIds();

			for (UUID previouslyStoredSoftwareId : previouslyStoredSoftwareIds) {
				if (!scrapedSoftware.contains(previouslyStoredSoftwareId)) {
					try {
						PostgrestConnector.deleteSoftware(BASE_URL, remoteId, previouslyStoredSoftwareId);
					} catch (RsdResponseException e) {
						LOGGER.error("Unknown error", e);
						Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, previouslyStoredSoftwareId, e);
					} catch (IOException e) {
						LOGGER.error("Unknown error", e);
						Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, previouslyStoredSoftwareId, e);
					} catch (InterruptedException e) {
						LOGGER.error("Got interrupted, early exiting deleting old entries", e);
						Utils.saveExceptionInDatabase(AGGREGATOR_SERVICE_NAME, REMOTE_SOFTWARE_TABLE_NAME, previouslyStoredSoftwareId, e);
						Thread.currentThread().interrupt();
						return;
					}
				}
			}
		}

		for (RemoteRsdData entry : remoteEntriesToScrape) {
			UUID id = entry.id();
			if (!softwarePerId.containsKey(id)) {
				PostgrestConnector.updateRefreshedTimeAndErrorMessage(BASE_URL, id, now, "Unknown error while scraping");
			}
		}

		long stop = System.nanoTime();
		LOGGER.info("Done aggregating RSDs ({} ms)", (stop - start) / 1000_000L);
	}

}
