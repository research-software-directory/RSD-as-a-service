package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

		crossrefTypeMap.put("Book Section", MentionType.book);
		crossrefTypeMap.put("Monograph", MentionType.other);
		crossrefTypeMap.put("Report", MentionType.report);
		crossrefTypeMap.put("Peer Review", MentionType.other);
		crossrefTypeMap.put("Book Track", MentionType.book);
		crossrefTypeMap.put("Journal Article", MentionType.journalArticle);
		crossrefTypeMap.put("Part", MentionType.other);
		crossrefTypeMap.put("Other", MentionType.other);
		crossrefTypeMap.put("Book", MentionType.book);
		crossrefTypeMap.put("Journal Volume", MentionType.other);
		crossrefTypeMap.put("Book Set", MentionType.book);
		crossrefTypeMap.put("Reference Entry", MentionType.other);
		crossrefTypeMap.put("Proceedings Article", MentionType.conferencePaper);
		crossrefTypeMap.put("Journal", MentionType.other);
		crossrefTypeMap.put("Component", MentionType.other);
		crossrefTypeMap.put("Book Chapter", MentionType.bookSection);
		crossrefTypeMap.put("Proceedings Series", MentionType.conferencePaper);
		crossrefTypeMap.put("Report Series", MentionType.other);
		crossrefTypeMap.put("Proceedings", MentionType.conferencePaper);
		crossrefTypeMap.put("Standard", MentionType.other);
		crossrefTypeMap.put("Reference Book", MentionType.book);
		crossrefTypeMap.put("Posted Content", MentionType.other);
		crossrefTypeMap.put("Journal Issue", MentionType.other);
		crossrefTypeMap.put("Dissertation", MentionType.thesis);
		crossrefTypeMap.put("Grant", MentionType.other);
		crossrefTypeMap.put("Dataset", MentionType.dataset);
		crossrefTypeMap.put("Book Series", MentionType.book);
		crossrefTypeMap.put("Edited Book", MentionType.book);
		crossrefTypeMap.put("Standard Series", MentionType.other);
	}

	private final String doi;

	public CrossrefMention(String doi) {
		this.doi = Objects.requireNonNull(doi);
	}

	@Override
	public MentionRecord mentionData() {
		StringBuilder url = new StringBuilder("https://api.crossref.org/works/" + URLDecoder.decode(doi, StandardCharsets.UTF_8));
		Config.crossrefContactEmail().ifPresent(email -> url.append("?mailto=" + email));
		String responseJson = Utils.get(url.toString());
		JsonObject jsonTree = JsonParser.parseString(responseJson).getAsJsonObject();
		MentionRecord result = new MentionRecord();
		JsonObject workJson = jsonTree.getAsJsonObject("message");

		result.doi = doi;
		result.url = URI.create("https://doi.org/" + result.doi);
		result.title = workJson.getAsJsonArray("title").get(0).getAsString();

		Collection<String> authors = new ArrayList<>();
		Iterable<JsonObject> authorsJson = (Iterable) workJson.getAsJsonArray("author");
		for (JsonObject authorJson : authorsJson) {
			String givenName = Utils.stringOrNull(authorJson.get("given"));
			String familyName = Utils.stringOrNull(authorJson.get("family"));
			if (givenName == null && familyName == null) continue;
			if (givenName == null) authors.add(familyName);
			else if (familyName == null) authors.add(givenName);
			else authors.add(givenName + " " + familyName);
		}
		result.authors = String.join(", ", authors);

		result.publisher = Utils.stringOrNull(workJson.get("publisher"));
		try {
			result.publicationYear = Utils.integerOrNull(workJson.getAsJsonObject("published").getAsJsonArray("date-parts").get(0).getAsJsonArray().get(0));
		} catch (RuntimeException e) {
//			year not found, we leave it at null, nothing to do
		}
		result.page = Utils.stringOrNull(workJson.get("page"));
		result.mentionType = crossrefTypeMap.getOrDefault(Utils.stringOrNull(workJson.get("type")), MentionType.other);
		result.source = "Crossref";
		result.scrapedAt = Instant.now();

		return result;
	}
}
