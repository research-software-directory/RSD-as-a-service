// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class CrossrefMention implements Mention {

	private static final Map<String, MentionType> crossrefTypeMap;

	static {
//		https://api.crossref.org/types
		crossrefTypeMap = new HashMap<>();

		crossrefTypeMap.put("book-section", MentionType.bookSection);
		crossrefTypeMap.put("monograph", MentionType.other);
		crossrefTypeMap.put("report", MentionType.report);
		crossrefTypeMap.put("peer-review", MentionType.other);
		crossrefTypeMap.put("book-track", MentionType.book);
		crossrefTypeMap.put("journal-article", MentionType.journalArticle);
		crossrefTypeMap.put("book-part", MentionType.bookSection);
		crossrefTypeMap.put("other", MentionType.other);
		crossrefTypeMap.put("book", MentionType.book);
		crossrefTypeMap.put("journal-volume", MentionType.journalArticle);
		crossrefTypeMap.put("book-set", MentionType.book);
		crossrefTypeMap.put("reference-entry", MentionType.other);
		crossrefTypeMap.put("proceedings-article", MentionType.conferencePaper);
		crossrefTypeMap.put("journal", MentionType.journalArticle);
		crossrefTypeMap.put("component", MentionType.other);
		crossrefTypeMap.put("book-chapter", MentionType.bookSection);
		crossrefTypeMap.put("proceedings-series", MentionType.conferencePaper);
		crossrefTypeMap.put("report-series", MentionType.report);
		crossrefTypeMap.put("proceedings", MentionType.conferencePaper);
		crossrefTypeMap.put("standard", MentionType.other);
		crossrefTypeMap.put("reference-book", MentionType.book);
		crossrefTypeMap.put("posted-content", MentionType.other);
		crossrefTypeMap.put("journal-issue", MentionType.journalArticle);
		crossrefTypeMap.put("dissertation", MentionType.thesis);
		crossrefTypeMap.put("grant", MentionType.other);
		crossrefTypeMap.put("dataset", MentionType.dataset);
		crossrefTypeMap.put("book-series", MentionType.book);
		crossrefTypeMap.put("edited-book", MentionType.book);
		crossrefTypeMap.put("standard-series", MentionType.other);
	}

	private final String doi;

	public CrossrefMention(String doi) {
		this.doi = Objects.requireNonNull(doi);
	}

	@Override
	public MentionRecord mentionData() {
		StringBuilder url = new StringBuilder("https://api.crossref.org/works/" + Utils.urlEncode(doi));
		Config.crossrefContactEmail().ifPresent(email -> url.append("?mailto=").append(email));
		String responseJson = Utils.get(url.toString());
		JsonObject jsonTree = JsonParser.parseString(responseJson).getAsJsonObject();
		MentionRecord result = new MentionRecord();
		JsonObject workJson = jsonTree.getAsJsonObject("message");

		result.doi = doi;
		result.url = URI.create("https://doi.org/" + Utils.urlEncode(result.doi));
		result.title = workJson.getAsJsonArray("title").get(0).getAsString();

		Collection<String> authors = new ArrayList<>();
		Iterable<JsonObject> authorsJson = (Iterable) workJson.getAsJsonArray("author");
		if (authorsJson != null) {
			for (JsonObject authorJson : authorsJson) {
				String givenName = Utils.stringOrNull(authorJson.get("given"));
				String familyName = Utils.stringOrNull(authorJson.get("family"));
				if (givenName == null && familyName == null) continue;
				if (givenName == null) authors.add(familyName);
				else if (familyName == null) authors.add(givenName);
				else authors.add(givenName + " " + familyName);
			}
			result.authors = String.join(", ", authors);
		}

		result.publisher = Utils.stringOrNull(workJson.get("publisher"));
		try {
			result.publicationYear = Utils.integerOrNull(workJson.getAsJsonObject("published").getAsJsonArray("date-parts").get(0).getAsJsonArray().get(0));
		} catch (RuntimeException e) {
//			year not found, we leave it at null, nothing to do
		}
		if (workJson.getAsJsonArray("container-title").size() > 0) {
			JsonArray journalTitles = workJson.getAsJsonArray("container-title");
			result.journal = journalTitles.get(0).getAsString();
			for (int i = 1; i < journalTitles.size(); i++) {
				result.journal += ", " + journalTitles.get(i).getAsString();
			}
		}
		result.page = Utils.stringOrNull(workJson.get("page"));
		result.mentionType = crossrefTypeMap.getOrDefault(Utils.stringOrNull(workJson.get("type")), MentionType.other);
		result.source = "Crossref";
		result.scrapedAt = Instant.now();

		return result;
	}
}
