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
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
		Map<Doi, RsdMentionIds> mentionsFailedToScrape = new HashMap<>();
		for (RsdMentionIds mentionIds : mentionsToScrape) {
			mentionsFailedToScrape.put(mentionIds.doi(), mentionIds);
		}

		String doisJoined = mentionsToScrape.stream()
				.map(RsdMentionIds::doi)
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
		Collection<Doi> dataciteDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("DataCite"))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		Collection<ExternalMentionRecord> scrapedDataciteMentions = List.of();
		try {
			scrapedDataciteMentions = new DataciteMentionRepository().mentionData(dataciteDois);
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("DataCite mention scraper", "mention", null, e);
		}
		for (ExternalMentionRecord scrapedMention : scrapedDataciteMentions) {
			Doi doi = scrapedMention.doi();
			RsdMentionIds ids = mentionsFailedToScrape.get(doi);
			try {
				RsdMentionRecord mentionToUpdate = new RsdMentionRecord(ids.id(), scrapedMention, now);
				localMentionRepository.updateMention(mentionToUpdate, false);
				mentionsFailedToScrape.remove(doi);
			} catch (Exception e) {
				LOGGER.error("Failed to update a DataCite mention with DOI {}", scrapedMention.doi());
				Utils.saveExceptionInDatabase("Mention scraper", "mention", ids.id(), e);
			}

		}
		// END DATACITE

		// CROSSREF
		Collection<Doi> crossrefDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("Crossref"))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		for (Doi crossrefDoi : crossrefDois) {
			ExternalMentionRecord scrapedMention;
			try {
				scrapedMention = new CrossrefMention(crossrefDoi).mentionData();
			} catch (Exception e) {
				LOGGER.error("Failed to scrape a Crossref mention with DOI {}", crossrefDoi);
				RuntimeException exceptionWithMessage = new RuntimeException("Failed to scrape a Crossref mention with DOI " + crossrefDoi, e);
				Utils.saveExceptionInDatabase("Crossref mention scraper", "mention", mentionsFailedToScrape.get(crossrefDoi).id(), exceptionWithMessage);
				continue;
			}
			Doi doi = scrapedMention.doi();
			RsdMentionIds ids = mentionsFailedToScrape.get(doi);
			RsdMentionRecord mentionToUpdate = new RsdMentionRecord(ids.id(), scrapedMention, now);
			try {
				localMentionRepository.updateMention(mentionToUpdate, false);
				mentionsFailedToScrape.remove(doi);
			} catch (Exception e) {
				RuntimeException exceptionWithMessage = new RuntimeException("Failed to update a Crossref mention with DOI " + crossrefDoi, e);
				Utils.saveExceptionInDatabase("Crossref mention scraper", "mention", ids.id(), exceptionWithMessage);
			}
		}
		// END CROSSREF

		// OPENALEX (for European Publication Office DOIs)
		String email = Config.crossrefContactEmail().orElse(null);
		Collection<ExternalMentionRecord> scrapedOpenalexMentions = List.of();
		Collection<Doi> europeanPublicationsOfficeDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("OP"))
				.map(Map.Entry::getKey)
				.map(Doi::fromString)
				.toList();
		try {
			scrapedOpenalexMentions = new OpenAlexCitations().mentionData(europeanPublicationsOfficeDois, email);
		} catch (Exception e) {
			Utils.saveExceptionInDatabase("OpenAlex mention scraper", "mention", null, e);
		}
		for (ExternalMentionRecord scrapedMention : scrapedOpenalexMentions) {
			Doi doi = scrapedMention.doi();
			RsdMentionIds ids = mentionsFailedToScrape.get(doi);
			RsdMentionRecord mentionToUpdate = new RsdMentionRecord(ids.id(), scrapedMention, now);
			try {
				localMentionRepository.updateMention(mentionToUpdate, true);
				mentionsFailedToScrape.remove(doi);
			} catch (Exception e) {
				LOGGER.error("Failed to update an OpenAlex mention with DOI {}", scrapedMention.doi());
				Utils.saveExceptionInDatabase("Mention scraper", "mention", ids.id(), e);
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
