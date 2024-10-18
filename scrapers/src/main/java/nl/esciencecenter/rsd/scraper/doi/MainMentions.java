// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class MainMentions {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainMentions.class);

	public static void main(String[] args) {

		LOGGER.info("Start scraping mentions");

		long t1 = System.currentTimeMillis();

		PostgrestMentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<RsdMentionIds> mentionsToScrape = localMentionRepository.leastRecentlyScrapedMentions(Config.maxRequestsDoi());
		// we will remove successfully scraped mentions from here,
		// we use this to set scrapedAt even for failed mentions,
		// to put them back at the scraping queue
		Map<UUID, RsdMentionIds> mentionsFailedToScrape = new HashMap<>();
		Map<Doi, UUID> doiToId = new HashMap<>();
		Map<OpenalexId, UUID> openalexIdToId = new HashMap<>();
		for (RsdMentionIds mentionIds : mentionsToScrape) {
			UUID id = mentionIds.id();
			mentionsFailedToScrape.put(id, mentionIds);

			Doi doi = mentionIds.doi();
			if (doi != null) {
				doiToId.put(doi, id);
			}

			OpenalexId openalexId = mentionIds.openalexId();
			if (openalexId != null) {
				openalexIdToId.put(openalexId, id);
			}
		}

		String doisJoined = mentionsToScrape.stream()
				.map(RsdMentionIds::doi)
				.filter(Objects::nonNull)
				.map(Doi::toUrlEncodedString)
				.collect(Collectors.joining(","));
		String jsonSources = null;
		try {
			jsonSources = Utils.get("https://doi.org/doiRA/" + doisJoined);
		} catch (Exception e) {
			Utils.saveExceptionInDatabase("DOI mention scraper", "mention", null, e);
			System.exit(1);
		}

		Map<String, String> doiToSource = parseJsonDoiSources(jsonSources);

		Instant now = Instant.now();

		// DATACITE
		final String dataciteDoiRaKey = "DataCite";
		Collection<Doi> dataciteDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals(dataciteDoiRaKey))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		Collection<ExternalMentionRecord> scrapedDataciteMentions = List.of();
		try {
			scrapedDataciteMentions = new DataciteMentionRepository().mentionData(dataciteDois);
		} catch (RuntimeException e) {
			Exception exceptionToSave = new Exception("Failed scraping the following DataCite DOIs: " + dataciteDois, e);
			Utils.saveExceptionInDatabase("DataCite mention scraper", "mention", null, exceptionToSave);
		}
		for (ExternalMentionRecord scrapedMention : scrapedDataciteMentions) {
			Doi doi = scrapedMention.doi();
			UUID id = doiToId.get(doi);
			try {
				RsdMentionRecord mentionToUpdate = new RsdMentionRecord(id, scrapedMention, now);
				localMentionRepository.updateMention(mentionToUpdate, false);
				mentionsFailedToScrape.remove(id);
			} catch (Exception e) {
				LOGGER.error("Failed to update a DataCite mention with DOI {}", scrapedMention.doi());
				Utils.saveExceptionInDatabase("Mention scraper", "mention", id, e);
			}

		}
		// END DATACITE

		// CROSSREF
		final String crossrefDoiRaKey = "Crossref";
		Collection<Doi> crossrefDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals(crossrefDoiRaKey))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		for (Doi crossrefDoi : crossrefDois) {
			ExternalMentionRecord scrapedMention;
			UUID id = doiToId.get(crossrefDoi);
			try {
				scrapedMention = new CrossrefMention(crossrefDoi).mentionData();
			} catch (Exception e) {
				LOGGER.error("Failed to scrape a Crossref mention with DOI {}", crossrefDoi);
				RuntimeException exceptionWithMessage = new RuntimeException("Failed to scrape a Crossref mention with DOI " + crossrefDoi, e);
				Utils.saveExceptionInDatabase("Crossref mention scraper", "mention", id, exceptionWithMessage);
				continue;
			}
			RsdMentionRecord mentionToUpdate = new RsdMentionRecord(id, scrapedMention, now);
			try {
				localMentionRepository.updateMention(mentionToUpdate, false);
				mentionsFailedToScrape.remove(id);
			} catch (Exception e) {
				RuntimeException exceptionWithMessage = new RuntimeException("Failed to update a Crossref mention with DOI " + crossrefDoi, e);
				Utils.saveExceptionInDatabase("Crossref mention scraper", "mention", id, exceptionWithMessage);
			}
		}
		// END CROSSREF

		// OPENALEX (other DOI registry agents)
		String email = Config.crossrefContactEmail().orElse(null);
		Collection<ExternalMentionRecord> scrapedOpenalexMentions = new ArrayList<>();
		OpenAlexConnector openAlexConnector = new OpenAlexConnector();
		Collection<String> invalidDoiRas = Set.of(dataciteDoiRaKey, crossrefDoiRaKey, "Invalid DOI", "DOI does not exist", "Unknown");
		Collection<Doi> europeanPublicationsOfficeDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> !invalidDoiRas.contains(doiSourceEntry.getValue()))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		try {
			scrapedOpenalexMentions.addAll(openAlexConnector.mentionDataByDois(europeanPublicationsOfficeDois, email));
		} catch (Exception e) {
			Exception exceptionToSave = new Exception("Failed scraping the following EPO DOIs: " + europeanPublicationsOfficeDois, e);
			Utils.saveExceptionInDatabase("OpenAlex mention scraper", "mention", null, exceptionToSave);
		}
		Collection<OpenalexId> openalexIdsToScrape = mentionsToScrape
				.stream()
				.filter(ids -> ids.doi() == null && ids.openalexId() != null)
				.map(RsdMentionIds::openalexId)
				.toList();
		try {
			scrapedOpenalexMentions.addAll(openAlexConnector.mentionDataByOpenalexIds(openalexIdsToScrape, email));
		} catch (Exception e) {
			Exception exceptionToSave = new Exception("Failed scraping the following OpenAlex IDs: " + openalexIdsToScrape, e);
			Utils.saveExceptionInDatabase("OpenAlex mention scraper", "mention", null, exceptionToSave);
		}

		for (ExternalMentionRecord scrapedMention : scrapedOpenalexMentions) {
			OpenalexId openalexId = scrapedMention.openalexId();
			UUID id = openalexIdToId.get(openalexId);
			RsdMentionRecord mentionToUpdate = new RsdMentionRecord(id, scrapedMention, now);
			try {
				localMentionRepository.updateMention(mentionToUpdate, true);
				mentionsFailedToScrape.remove(id);
			} catch (Exception e) {
				LOGGER.error("Failed to update an OpenAlex mention with DOI {}", scrapedMention.doi());
				Utils.saveExceptionInDatabase("Mention scraper", "mention", id, e);
			}
		}
		// END OPENALEX

		for (RsdMentionIds ids : mentionsFailedToScrape.values()) {
			LOGGER.error("Failed to scrape mention with DOI {}", ids.doi());
			try {
				localMentionRepository.saveScrapedAt(ids, now);
			} catch (RuntimeException e) {
				Utils.saveExceptionInDatabase("Mention scraper", "mention", ids.id(), e);
			}
		}

		long time = System.currentTimeMillis() - t1;
		LOGGER.info("Done scraping mentions ({} ms.)", time);
	}

	static Map<String, String> parseJsonDoiSources(String jsonSources) {
		JsonArray sourcesArray = JsonParser.parseString(jsonSources).getAsJsonArray();
		Map<String, String> result = new HashMap<>();
		for (JsonElement jsonElement : sourcesArray) {
			JsonObject jsonPair = jsonElement.getAsJsonObject();
			String doi = jsonPair.getAsJsonPrimitive("DOI").getAsString();
			JsonElement jsonStatus = jsonPair.get("status");
			if (jsonStatus == null) {
				String source = jsonPair.getAsJsonPrimitive("RA").getAsString();
				result.put(doi, source);
			} else {
				String status = jsonStatus.getAsString();
				result.put(doi, status);
			}
		}
		return result;
	}
}
