package nl.esciencecenter.rsd.migration;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Main {

	public static final String LEGACY_RSD_SOFTWARE_URI = "https://research-software.nl/api/software";
	public static final String LEGACY_RSD_PROJECT_URI = "https://research-software.nl/api/project";
	public static final String LEGACY_RSD_PERSON_URI = "https://research-software.nl/api/person";
	public static final String LEGACY_RSD_MENTION_URI = "https://research-software.nl/api/mention";
	public static final String PORSGREST_URI = "http://localhost:3000";

	public static void main(String[] args) {
		String allSoftwareString = get(URI.create(LEGACY_RSD_SOFTWARE_URI));
		JsonArray allSoftwareFromLegacyRSD = JsonParser.parseString(allSoftwareString).getAsJsonArray();

		removeProblematicEntry(allSoftwareFromLegacyRSD);

		tryBackendConnection();

		saveSoftware(allSoftwareFromLegacyRSD);
		Map<String, String> slugToId = slugToId();
		saveRepoUrls(allSoftwareFromLegacyRSD, slugToId);
		saveLicenses(allSoftwareFromLegacyRSD, slugToId);
		saveTags(allSoftwareFromLegacyRSD, slugToId);
		saveContributors(allSoftwareFromLegacyRSD, slugToId);

		String allProjectsString = get(URI.create(LEGACY_RSD_PROJECT_URI));
		JsonArray allProjectsFromLegacyRSD = JsonParser.parseString(allProjectsString).getAsJsonArray();
		saveProjects(allProjectsFromLegacyRSD);
		saveProjectImages(allProjectsFromLegacyRSD);

		String allMentionsString = get(URI.create(LEGACY_RSD_MENTION_URI));
		JsonArray allMentionsFromLegacyRSD = JsonParser.parseString(allMentionsString).getAsJsonArray();
		saveMentions(allMentionsFromLegacyRSD);
		saveMentionsForSoftware(allMentionsFromLegacyRSD, allSoftwareFromLegacyRSD, slugToId);
	}

	public static void removeProblematicEntry(JsonArray softwareArray) {
		Iterator<JsonElement> iterator = softwareArray.iterator();
		while (iterator.hasNext()) {
			String slugToCheck = iterator.next().getAsJsonObject().get("slug").getAsString();
//			this entry is problematic, it contains many nulls, we skip it for now, whe should later either allow more
//			null fields or set default empty strings as values
			if (slugToCheck.equals("palmetto-position-lucene-wikipedia")) {
				iterator.remove();
				break;
			}
		}
	}

	public static void tryBackendConnection() {
		int maxTries = 20;
		for (int tryConnectionCount = 0; tryConnectionCount < maxTries; tryConnectionCount++) {
			pauseExecution(500);
			try {
				get(URI.create(PORSGREST_URI));
			} catch (RuntimeException e) {
				continue;
			}
			return;
		}
		throw new RuntimeException("Connection to the backend could not be established");
	}

	public static void pauseExecution(long milis) {
		try {
			Thread.sleep(milis);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	public static void saveSoftware(JsonArray allSoftwareFromLegacyRSD) {
		JsonArray allSoftwareToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareToSave = new JsonObject();
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

			softwareToSave.add("slug", softwareFromLegacyRSD.get("slug"));
			softwareToSave.add("brand_name", softwareFromLegacyRSD.get("brandName"));
			softwareToSave.add("bullets", softwareFromLegacyRSD.get("bullets"));
			softwareToSave.add("get_started_url", softwareFromLegacyRSD.get("getStartedURL"));
			softwareToSave.add("is_featured", softwareFromLegacyRSD.get("isFeatured"));
			softwareToSave.add("is_published", softwareFromLegacyRSD.get("isPublished"));
			softwareToSave.add("read_more", softwareFromLegacyRSD.get("readMore"));
			softwareToSave.add("short_statement", softwareFromLegacyRSD.get("shortStatement"));

			allSoftwareToSave.add(softwareToSave);
		});
		post(URI.create(PORSGREST_URI + "/software"), allSoftwareToSave.toString());
	}

	public static Map<String, String> slugToId() {
		JsonArray savedSoftware = JsonParser.parseString(get(URI.create(PORSGREST_URI + "/software?select=id,slug"))).getAsJsonArray();
		Map<String, String> slugToId = new HashMap<>();
		savedSoftware.forEach(jsonElement -> {
			String slug = jsonElement.getAsJsonObject().get("slug").getAsString();
			String id = jsonElement.getAsJsonObject().get("id").getAsString();
			slugToId.put(slug, id);
		});
		return slugToId;
	}

	public static void saveRepoUrls(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
//		unfortunately, PostgREST doesn't allow for patching or posting when using resource embedding,
//		therefore, we need to get the just saved software id's in order to populate the repository_url table
		JsonArray allRepoUrlsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple urls is with slug vantage6
			JsonArray urls = softwareFromLegacyRSD.get("repositoryURLs").getAsJsonObject().get("github").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
			urls.forEach(jsonUrl -> {
				JsonObject repoUrlToSave = new JsonObject();
				repoUrlToSave.addProperty("software", slugToId.get(slug));
				repoUrlToSave.add("url", jsonUrl);
				allRepoUrlsToSave.add(repoUrlToSave);
			});
		});
		post(URI.create(PORSGREST_URI + "/repository_url"), allRepoUrlsToSave.toString());
	}

	public static void saveLicenses(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allLicensesToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple licenses is with slug eucp-atlas
			JsonArray licenses = softwareFromLegacyRSD.get("license").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
			licenses.forEach(jsonLicense -> {
				JsonObject licenseToSave = new JsonObject();
				licenseToSave.addProperty("software", slugToId.get(slug));
				licenseToSave.add("license", jsonLicense);
				allLicensesToSave.add(licenseToSave);
			});
		});
		post(URI.create(PORSGREST_URI + "/license_for_software"), allLicensesToSave.toString());
	}

	public static void saveTags(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allTagsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple tags is with slug ahn2webviewer
			JsonArray tags = softwareFromLegacyRSD.get("tags").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
			tags.forEach(jsonTag -> {
				JsonObject tagToSave = new JsonObject();
				tagToSave.addProperty("software", slugToId.get(slug));
				tagToSave.add("tag", jsonTag);
				allTagsToSave.add(tagToSave);
			});
		});
		post(URI.create(PORSGREST_URI + "/tag_for_software"), allTagsToSave.toString());
	}

	public static void saveContributors(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
//		TODO: affiliations from contributors? YES, mapping to ROR possible?
		String allPersonsString = get(URI.create(LEGACY_RSD_PERSON_URI));
		JsonArray allPersonsFromLegacyRSD = JsonParser.parseString(allPersonsString).getAsJsonArray();

//		each person has an id, we need to find the person given this id since the software api only lists the id's
		Map<String, JsonObject> personIdToObject = new HashMap<>();
		allPersonsFromLegacyRSD.forEach(jsonPerson -> {
			String id = jsonPerson.getAsJsonObject().getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			if (personIdToObject.containsKey(id)) throw new RuntimeException("Duplicate id for person exists: " + id);
			personIdToObject.put(id, jsonPerson.getAsJsonObject());
		});

		JsonArray allContributorsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonSoftware -> {
			JsonObject softwareFromLegacyRSD = jsonSoftware.getAsJsonObject();
			String slug = softwareFromLegacyRSD.getAsJsonPrimitive("slug").getAsString();
			String softwareId = slugToId.get(slug);

			JsonArray contributorsForSoftware = softwareFromLegacyRSD.getAsJsonArray("contributors");
			contributorsForSoftware.forEach(jsonContributor -> {
				JsonObject contributorFromLegacyRSD = jsonContributor.getAsJsonObject();
				JsonObject contributorToSave = new JsonObject();

				contributorToSave.addProperty("software", softwareId);
				contributorToSave.add("is_contact_person", contributorFromLegacyRSD.get("isContactPerson"));
				String personId = contributorFromLegacyRSD.getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				JsonObject personData = personIdToObject.get(personId);
				contributorToSave.add("email_address", nullIfBlank(personData.get("emailAddress")));
				contributorToSave.add("family_names", personData.get("familyNames"));
				contributorToSave.add("given_names", personData.get("givenNames"));
				contributorToSave.add("name_particle", nullIfBlank(personData.get("nameParticle")));
				contributorToSave.add("name_suffix", nullIfBlank(personData.get("nameSuffix")));

				allContributorsToSave.add(contributorToSave);
			});
		});
		post(URI.create(PORSGREST_URI + "/contributor"), allContributorsToSave.toString());
	}

	public static JsonElement nullIfBlank(JsonElement jsonString) {
		if (jsonString == null || jsonString.isJsonNull()) return JsonNull.INSTANCE;
		String stringToCheck = jsonString.getAsString();
		if (stringToCheck.isBlank()) return JsonNull.INSTANCE;
		else return jsonString;
	}

	public static void saveProjects(JsonArray allProjectsFromLegacyRSD) {
		JsonArray allProjectsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectToSave = new JsonObject();
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			projectToSave.add("slug", projectFromLegacyRSD.get("slug"));
			projectToSave.add("call_url", projectFromLegacyRSD.get("callUrl"));
			projectToSave.add("code_url", projectFromLegacyRSD.get("codeUrl"));
			projectToSave.add("data_management_plan_url", projectFromLegacyRSD.get("dataManagementPlanUrl"));
			projectToSave.add("date_end", projectFromLegacyRSD.get("dateEnd"));
			projectToSave.add("date_start", projectFromLegacyRSD.get("dateStart"));
			projectToSave.add("description", projectFromLegacyRSD.get("description"));
			projectToSave.add("grant_id", projectFromLegacyRSD.get("grantId"));
			projectToSave.add("home_url", projectFromLegacyRSD.get("homeUrl"));
			projectToSave.add("image_caption", projectFromLegacyRSD.get("imageCaption"));
			projectToSave.add("is_published", projectFromLegacyRSD.get("isPublished"));
			projectToSave.add("software_sustainability_plan_url", projectFromLegacyRSD.get("softwareSustainabilityPlanUrl"));
			projectToSave.add("subtitle", projectFromLegacyRSD.get("subtitle"));
			projectToSave.add("title", projectFromLegacyRSD.get("title"));
			allProjectsToSave.add(projectToSave);
		});
		post(URI.create(PORSGREST_URI + "/project"), allProjectsToSave.toString());
	}

	public static void saveProjectImages(JsonArray allProjectsFromLegacyRSD) {
		JsonArray savedProjects = JsonParser.parseString(get(URI.create(PORSGREST_URI + "/project?select=id,slug"))).getAsJsonArray();
		Map<String, String> slugToId = new HashMap<>();
		savedProjects.forEach(jsonElement -> {
			String slug = jsonElement.getAsJsonObject().get("slug").getAsString();
			String id = jsonElement.getAsJsonObject().get("id").getAsString();
			slugToId.put(slug, id);
		});

		JsonArray allImagesToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectsFromLegacyRSD = jsonElement.getAsJsonObject();
			JsonObject imageFromLegacyRSD = projectsFromLegacyRSD.getAsJsonObject("image");

			String slug = projectsFromLegacyRSD.get("slug").getAsString();
			JsonObject imageToSave = new JsonObject();
			imageToSave.addProperty("project", slugToId.get(slug));
			imageToSave.add("data", imageFromLegacyRSD.get("data"));
			imageToSave.add("mime_type", imageFromLegacyRSD.get("mimeType"));
			allImagesToSave.add(imageToSave);
		});
		post(URI.create(PORSGREST_URI + "/image_for_project"), allImagesToSave.toString());
	}

	public static void saveMentions(JsonArray allMentionsFromLegacyRSD) {
		JsonArray allMentionsToSave = new JsonArray();
		allMentionsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject mentionToSave = new JsonObject();
			JsonObject mentionFromLegacyRSD = jsonElement.getAsJsonObject();

			mentionToSave.add("author", mentionFromLegacyRSD.get("author"));
			mentionToSave.add("date", mentionFromLegacyRSD.get("date"));
			mentionToSave.add("image", mentionFromLegacyRSD.get("image"));
			mentionToSave.add("is_corporate_blog", mentionFromLegacyRSD.get("isCorporateBlog"));
			mentionToSave.add("title", mentionFromLegacyRSD.get("title"));
			mentionToSave.add("type", mentionFromLegacyRSD.get("type"));
			mentionToSave.add("url", mentionFromLegacyRSD.get("url"));
			mentionToSave.add("version", mentionFromLegacyRSD.get("version"));
			mentionToSave.add("zotero_key", mentionFromLegacyRSD.get("zoteroKey"));

			allMentionsToSave.add(mentionToSave);
		});
		post(URI.create(PORSGREST_URI + "/mention"), allMentionsToSave.toString());
	}

	public static void saveMentionsForSoftware(JsonArray allMentionsFromLegacyRSD, JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
//		So we have a problem here: how to uniquely identify a mention?
//		This is needed to retrieve the primary key for a mention after it is saved in Postgres.
//		Unfortunately, title is not unique, zotero_key can be null.
//		Luckily, the combination of title and zotero_key is unique at the time of writing.
//		We throw an exception if this is not the case in the future.
		JsonArray savedMentions = JsonParser.parseString(get(URI.create(PORSGREST_URI + "/mention?select=id,title,zotero_key"))).getAsJsonArray();
		Map<MentionRecord, String> mentionToId = new HashMap<>();
		savedMentions.forEach(jsonMention -> {
			String id = jsonMention.getAsJsonObject().getAsJsonPrimitive("id").getAsString();
			String title = jsonMention.getAsJsonObject().getAsJsonPrimitive("title").getAsString();
			String zoteroKey = jsonMention.getAsJsonObject().getAsJsonPrimitive("zotero_key").getAsString();
			mentionToId.put(new MentionRecord(title, zoteroKey), id);
		});
		if (mentionToId.size() != allMentionsFromLegacyRSD.size())
			throw new RuntimeException("Mention sizes not equal, is " + mentionToId.size() + " but should be " + allMentionsFromLegacyRSD.size());

		Map<String, MentionRecord> legacyIdToRecord = new HashMap<>();
		allMentionsFromLegacyRSD.forEach(legacyMention -> {
			JsonObject legacyMentionObject = legacyMention.getAsJsonObject();
			String legacyId = legacyMentionObject.getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String legacyTitle = legacyMentionObject.getAsJsonPrimitive("title").getAsString();
			String legacyZoteroKey = legacyMentionObject.getAsJsonPrimitive("zoteroKey").getAsString();
			legacyIdToRecord.put(legacyId, new MentionRecord(legacyTitle, legacyZoteroKey));
		});

		JsonArray allMentionsForSoftwareToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(legacySoftware -> {
			String slug = legacySoftware.getAsJsonObject().getAsJsonPrimitive("slug").getAsString();
			legacySoftware.getAsJsonObject().getAsJsonObject("related").getAsJsonArray("mentions").forEach(legacyMention -> {
				String legacyId = legacyMention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				MentionRecord mentionRecord = legacyIdToRecord.get(legacyId);
				String newId = mentionToId.get(mentionRecord);
				JsonObject mentionForSoftwareToSave = new JsonObject();
				mentionForSoftwareToSave.addProperty("mention", newId);
				mentionForSoftwareToSave.addProperty("software", slugToId.get(slug));
				allMentionsForSoftwareToSave.add(mentionForSoftwareToSave);
			});
		});
		post(URI.create(PORSGREST_URI + "/mention_for_software"), allMentionsForSoftwareToSave.toString());
	}

	public static String get(URI uri) {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(uri)
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: " + response.body());
		}
		return response.body();
	}

	public static String post(URI uri, String json) {
		HttpRequest request = HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.ofString(json))
				.uri(uri)
				.header("Content-Type", "application/json")
				.build();
		HttpClient client = HttpClient.newHttpClient();
		HttpResponse<String> response;
		try {
			response = client.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
		if (response.statusCode() >= 300) {
			throw new RuntimeException("Error fetching data from the endpoint: " + response.body());
		}
		return response.body();
	}
}
