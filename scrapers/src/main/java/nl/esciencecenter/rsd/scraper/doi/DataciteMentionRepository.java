package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class DataciteMentionRepository implements MentionRepository {

	private static final String QUERY_UNFORMATTED = """
			query {
			  works(ids: [%s]) {
			    nodes {
			      doi
			      types {
			        resourceTypeGeneral
			      }
			      version
			      titles(first: 1) {
			        title
			      }
			      publisher
			      publicationYear
			      creators {
			        givenName
			        familyName
			      }
			      contributors {
			        givenName
			        familyName
			      }
			    }
			  }
			}""";

	private static final Map<String, MentionType> dataciteTypeMap;

	static {
//		https://schema.datacite.org/meta/kernel-4.3/
		dataciteTypeMap = new HashMap<>();

		dataciteTypeMap.put("Audiovisual", MentionType.other);
		dataciteTypeMap.put("Collection", MentionType.other);
		dataciteTypeMap.put("DataPaper", MentionType.other);
		dataciteTypeMap.put("Dataset", MentionType.dataset);
		dataciteTypeMap.put("Event", MentionType.other);
		dataciteTypeMap.put("Image", MentionType.other);
		dataciteTypeMap.put("InteractiveResource", MentionType.other);
		dataciteTypeMap.put("Model", MentionType.other);
		dataciteTypeMap.put("PhysicalObject", MentionType.other);
		dataciteTypeMap.put("Service", MentionType.other);
		dataciteTypeMap.put("Software", MentionType.computerProgram);
		dataciteTypeMap.put("Sound", MentionType.other);
		dataciteTypeMap.put("Text", MentionType.other);
		dataciteTypeMap.put("Workflow", MentionType.other);
		dataciteTypeMap.put("Other", MentionType.other);
	}

	//	"10.5281/zenodo.1408128","10.1186/s12859-018-2165-7"
	static String joinCollection(Collection<String> dois) {
		return dois.stream()
				.collect(Collectors.joining("\",\"", "\"", "\""));
	}

	static Collection<MentionRecord> jsonStringToMention(String json) {
		JsonObject root = JsonParser.parseString(json).getAsJsonObject();
		JsonArray worksJson = root.getAsJsonObject("data").getAsJsonObject("works").getAsJsonArray("nodes");
		Collection<MentionRecord> mentions = new ArrayList<>();
		for (JsonElement work : worksJson) {
			try {
				mentions.add(parseWork(work.getAsJsonObject()));
			} catch (RuntimeException e) {
				System.out.println("Failed to scrape a DataCite mention with data " + work);
				e.printStackTrace();
			}
		}
		return mentions;
	}

	static MentionRecord parseWork(JsonObject work) {
		MentionRecord result = new MentionRecord();
		result.doi = work.get("doi").getAsString();
		result.url = URI.create("https://doi.org/" + result.doi);
		result.title = work.getAsJsonArray("titles").get(0).getAsJsonObject().get("title").getAsString();

		Collection<String> authors = new ArrayList<>();
		Iterable<JsonObject> creators = (Iterable) work.getAsJsonArray("creators");
		for (JsonObject creator : creators) {
			addAuthor(authors, creator);
		}
		Iterable<JsonObject> contributors = (Iterable) work.getAsJsonArray("contributors");
		for (JsonObject contributor : contributors) {
			addAuthor(authors, contributor);
		}
		result.authors = String.join(", ", authors);

		result.publisher = Utils.stringOrNull(work.get("publisher"));
		result.publicationYear = Utils.integerOrNull(work.get("publicationYear"));
		result.mentionType = dataciteTypeMap.getOrDefault(Utils.stringOrNull(work.get("resourceTypeGeneral")), MentionType.other);
		result.source = "DataCite";
		result.scrapedAt = Instant.now();
		return result;
	}

	static void addAuthor(Collection<String> authors, JsonObject author) {
		String givenName = Utils.stringOrNull(author.get("givenName"));
		String familyName = Utils.stringOrNull(author.get("familyName"));
		if (givenName == null && familyName == null) return;
		if (givenName == null) authors.add(familyName);
		else if (familyName == null) authors.add(givenName);
		else authors.add(givenName + " " + familyName);
	}

	@Override
	public Collection<MentionRecord> leastRecentlyScrapedMentions(int limit) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Collection<MentionRecord> mentionData(Collection<String> dois) {
		JsonObject body = new JsonObject();
		body.addProperty("query", QUERY_UNFORMATTED.formatted(joinCollection(dois)));
		String responseJson = Utils.post("https://api.datacite.org/graphql", body.toString(), "Content-Type", "application/json");
		return jsonStringToMention(responseJson);
	}

	@Override
	public void save(Collection<MentionRecord> mentions) {
		throw new UnsupportedOperationException();
	}

}
