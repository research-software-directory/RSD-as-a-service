// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class CrossrefMention {

	static final Map<String, MentionType> crossrefTypeMap;

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

	private final Doi doi;

	public CrossrefMention(Doi doi) {
		this.doi = Objects.requireNonNull(doi);
	}

	public ExternalMentionRecord mentionData() throws IOException, InterruptedException, RsdResponseException {
		StringBuilder crossrefUrlBuilder = new StringBuilder("https://api.crossref.org/works/" + Utils.urlEncode(doi.toString()));
		Config.crossrefContactEmail().ifPresent(email -> crossrefUrlBuilder.append("?mailto=").append(email));
		String responseJson = Utils.get(crossrefUrlBuilder.toString());
		JsonObject jsonTree = JsonParser.parseString(responseJson).getAsJsonObject();
		JsonObject workJson = jsonTree.getAsJsonObject("message");

		URI mentionUrl = URI.create("https://doi.org/" + Utils.urlEncode(this.doi.toString()));
		String title = workJson.getAsJsonArray("title").get(0).getAsString();

		Collection<String> authorsBuilder = new ArrayList<>();
		String authors = null;
		Iterable<JsonObject> authorsJson = (Iterable) workJson.getAsJsonArray("author");
		if (authorsJson != null) {
			for (JsonObject authorJson : authorsJson) {
				String givenName = Utils.stringOrNull(authorJson.get("given"));
				String familyName = Utils.stringOrNull(authorJson.get("family"));
				String name = Utils.stringOrNull(authorJson.get("name"));
				if (givenName != null && familyName != null) {
					authorsBuilder.add(givenName + " " + familyName);
				} else if (name != null) {
					authorsBuilder.add(name);
				} else if (givenName != null) {
					authorsBuilder.add(givenName);
				} else if (familyName != null) {
					authorsBuilder.add(familyName);
				}
			}
			authors = String.join(", ", authorsBuilder);
		}

		String publisher = Utils.stringOrNull(workJson.get("publisher"));
		Integer publicationYear = null;
		try {
			publicationYear = Utils.integerOrNull(workJson.getAsJsonObject("published").getAsJsonArray("date-parts").get(0).getAsJsonArray().get(0));
		} catch (RuntimeException e) {
			//			year not found, we leave it at null, nothing to do
		}
		String journal = null;
		if (!workJson.getAsJsonArray("container-title").isEmpty()) {
			JsonArray journalTitles = workJson.getAsJsonArray("container-title");
			StringBuilder journalBuilder = new StringBuilder(journalTitles.get(0).getAsString());
			for (int i = 1; i < journalTitles.size(); i++) {
				journalBuilder.append(", ").append(journalTitles.get(i).getAsString());
			}
			journal = journalBuilder.toString();
		}
		String page = Utils.stringOrNull(workJson.get("page"));
		MentionType mentionType = crossrefTypeMap.getOrDefault(Utils.stringOrNull(workJson.get("type")), MentionType.other);

		return new ExternalMentionRecord(
				this.doi,
				null,
				null,
				mentionUrl,
				title,
				authors,
				publisher,
				publicationYear,
				journal,
				page,
				mentionType,
				"Crossref",
				null
		);
	}
}
