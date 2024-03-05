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
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class MainMentions {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainMentions.class);
	
	public static void main(String[] args) {
		
		LOGGER.info("Start scraping mentions");
		
		long t1 = System.currentTimeMillis();
		
		MentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<MentionRecord> mentionsToScrape = localMentionRepository.leastRecentlyScrapedMentions(Config.maxRequestsDoi());
		// we will remove successfully scraped mentions from here,
		// we use this to set scrapedAt even for failed mentions,
		// to put them back at the scraping order
		Map<String, MentionRecord> mentionsFailedToScrape = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		for (MentionRecord mentionRecord : mentionsToScrape) {
			mentionsFailedToScrape.put(mentionRecord.doi, mentionRecord);
		}

		String doisJoined = mentionsToScrape.stream()
				.map(mention -> mention.doi)
				.map(Utils::urlEncode)
				.collect(Collectors.joining(","));
		String jsonSources = null;
		try {
			jsonSources = Utils.get("https://doi.org/doiRA/" + doisJoined);
		} catch (Exception e) {
			Utils.saveExceptionInDatabase("DOI mention scraper", "mention", null, e);
			System.exit(1);
		}

		Map<String, String> doiToSource = parseJsonSources(jsonSources);

		Collection<MentionRecord> scrapedMentions = new ArrayList<>();
		Collection<String> dataciteDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("DataCite"))
				.map(Map.Entry::getKey)
				.toList();
		try {
			scrapedMentions.addAll(new DataciteMentionRepository().mentionData(dataciteDois));
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("DataCite mention scraper", "mention", null, e);
		}
		for (MentionRecord scrapedMention : scrapedMentions) {
			mentionsFailedToScrape.remove(scrapedMention.doi);
		}

		Collection<String> crossrefDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("Crossref"))
				.map(Map.Entry::getKey)
				.toList();
		for (String crossrefDoi : crossrefDois) {
			try {
				MentionRecord scrapedMention = new CrossrefMention(crossrefDoi).mentionData();
				scrapedMentions.add(scrapedMention);
				mentionsFailedToScrape.remove(scrapedMention.doi);
			} catch (Exception e) {
				RuntimeException exceptionWithMessage = new RuntimeException("Failed to scrape a Crossref mention with DOI " + crossrefDoi, e);
				Utils.saveExceptionInDatabase("Crossref mention scraper", "mention", null, exceptionWithMessage);
			}
		}

		String email = Config.crossrefContactEmail().orElse(null);
		Collection<String> europeanPublicationsOfficeDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("OP"))
				.map(Map.Entry::getKey)
				.toList();
		try {
			Collection<MentionRecord> openalexMentions = new OpenAlexCitations().mentionData(europeanPublicationsOfficeDois, email);
			for (MentionRecord openalexMention : openalexMentions) {
				mentionsFailedToScrape.remove(openalexMention.doi);
				scrapedMentions.add(openalexMention);
			}
		} catch (Exception e) {
			Utils.saveExceptionInDatabase("DataCite mention scraper", "mention", null, e);
		}

		Instant now = Instant.now();
		for (MentionRecord mention : mentionsFailedToScrape.values()) {
			mention.scrapedAt = now;
			LOGGER.info("Failed to scrape mention with DOI {}", mention.doi);
		}
		scrapedMentions.addAll(mentionsFailedToScrape.values());


		try {
			localMentionRepository.save(scrapedMentions);
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("Mention scraper", "mention", null, e);
		}

		long time = System.currentTimeMillis() - t1;

		LOGGER.info("Done scraping mentions ({} ms.)", time);
	}

	static Map<String, String> parseJsonSources(String jsonSources) {
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
