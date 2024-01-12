// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Config;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;
import java.util.TreeSet;

public class CheckCitations {

	public static void main(String[] args) {
		System.out.println("Start scraping citations");

		long start = System.currentTimeMillis();


		try {
                        Collection<CitationData> referencePapersToScrape = new ArrayList<>();

		        for (String doi : args) { 
			       CitationData data = new CitationData();
                               data.id = UUID.randomUUID();
			       data.doi = doi;
                               data.knownDois = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
                               referencePapersToScrape.add(data);
                        }

			OpenAlexCitations openAlexCitations = new OpenAlexCitations();
			String email = Config.crossrefContactEmail().orElse(null);
			ZonedDateTime now = ZonedDateTime.now();

			for (CitationData citationData : referencePapersToScrape) {
				Collection<MentionRecord> citingMentions = openAlexCitations.citations(citationData.doi, email, citationData.id);

 				System.out.printf("Found %d citations\n", citingMentions.size());

				int i=0;

				for (MentionRecord citingMention : citingMentions) {
					System.out.printf("%d: %s %s\n", i++, citingMention.doi, citingMention.title);
				}

			}
		} catch (RuntimeException e) {
			System.err.println("Failed to scrape citation" + e.getMessage());
			e.printStackTrace(System.err);
		}

		long time = System.currentTimeMillis() - start;

		System.out.println("Done scraping citations (" + time + " ms.)");
	}
}
