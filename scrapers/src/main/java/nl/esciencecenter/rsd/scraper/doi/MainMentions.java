// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class MainMentions {

	public static void main(String[] args) {
		System.out.println("Start scraping mentions");
		MentionRepository localMentionRepository = new PostgrestMentionRepository(Config.backendBaseUrl());
		Collection<MentionRecord> mentionsToScrape = localMentionRepository.leastRecentlyScrapedMentions(Config.maxRequestsDoi());
//		we will remove successfully scraped mentions from here,
//		we use this to set scrapedAt even for failed mentions,
//		to put them back at the scraping order
		Map<String, MentionRecord> mentionsFailedToScrape = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		for (MentionRecord mentionRecord : mentionsToScrape) {
			mentionsFailedToScrape.put(mentionRecord.doi, mentionRecord);
		}

		String doisJoined = mentionsToScrape.stream()
				.map(mention -> mention.doi)
				.map(doi -> Utils.urlEncode(doi))
				.collect(Collectors.joining(","));
		String jsonSources = Utils.get("https://doi.org/doiRA/" + doisJoined);

		Map<String, String> doiToSource = parseJsonSources(jsonSources);

		Collection<MentionRecord> scrapedMentions = new ArrayList<>();
		Collection<String> dataciteDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("DataCite"))
				.map(doiSourceEntry -> doiSourceEntry.getKey())
				.toList();
		try {
			scrapedMentions.addAll(new DataciteMentionRepository().mentionData(dataciteDois));
		} catch (RuntimeException e) {
			System.out.println("Failed to scrape from DataCite");
			e.printStackTrace();
		}
		for (MentionRecord scrapedMention : scrapedMentions) {
			mentionsFailedToScrape.remove(scrapedMention.doi);
		}

		Collection<String> crossrefDois = doiToSource.entrySet()
				.stream()
				.filter(doiSourceEntry -> doiSourceEntry.getValue().equals("Crossref"))
				.map(doiSourceEntry -> doiSourceEntry.getKey())
				.toList();
		for (String crossrefDoi : crossrefDois) {
			try {
				MentionRecord scrapedMention = new CrossrefMention(crossrefDoi).mentionData();
				scrapedMentions.add(scrapedMention);
				mentionsFailedToScrape.remove(scrapedMention.doi);
			} catch (RuntimeException e) {
				System.out.println("Failed to scrape a Crossref mention with DOI " + crossrefDoi);
				e.printStackTrace();
			}
		}

		Instant now = Instant.now();
		for (MentionRecord mention : mentionsFailedToScrape.values()) {
			mention.scrapedAt = now;
		}
		scrapedMentions.addAll(mentionsFailedToScrape.values());


		localMentionRepository.save(scrapedMentions);

		System.out.println("Done scraping mentions");
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
