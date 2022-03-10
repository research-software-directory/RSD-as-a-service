package nl.esciencecenter.rsd.migration;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class Main {

	static final long TEN_MINUTES_IN_MILLISECONDS = 600_000L; // 10 * 60 * 1000
	static String jwtString;

	public static final String LEGACY_RSD_SOFTWARE_URI = "https://research-software.nl/api/software";
	public static final String LEGACY_RSD_PROJECT_URI = "https://research-software.nl/api/project";
	public static final String LEGACY_RSD_PERSON_URI = "https://research-software.nl/api/person";
	public static final String LEGACY_RSD_MENTION_URI = "https://research-software.nl/api/mention";
	public static final String LEGACY_RSD_RELEASE_URI = "https://research-software.nl/api/release";
	public static final String LEGACY_RSD_ORGANISATION_URI = "https://research-software.nl/api/organization";
	public static final String POSTGREST_URI = "http://localhost/api/v1";

	public static void main(String[] args) throws IOException {
		String signingSecret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(signingSecret);
		jwtString = JWT.create()
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + TEN_MINUTES_IN_MILLISECONDS))
				.sign(signingAlgorithm);

		String allSoftwareString = get(URI.create(LEGACY_RSD_SOFTWARE_URI));
		JsonArray allSoftwareFromLegacyRSD = JsonParser.parseString(allSoftwareString).getAsJsonArray();

		removeProblematicEntry(allSoftwareFromLegacyRSD);

		tryBackendConnection();

		saveSoftware(allSoftwareFromLegacyRSD);
		Map<String, String> slugToIdSoftware = slugToId("/software?select=id,slug");
		Map<String, String> legacyIdToNewIdSoftware = idToId(allSoftwareFromLegacyRSD, slugToIdSoftware);
		saveRepoUrls(allSoftwareFromLegacyRSD, slugToIdSoftware);
		saveLicenses(allSoftwareFromLegacyRSD, slugToIdSoftware);
		saveTagsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware);
		String allPersonsString = get(URI.create(LEGACY_RSD_PERSON_URI));
		JsonArray allPersonsFromLegacyRSD = JsonParser.parseString(allPersonsString).getAsJsonArray();
		String allOrganisationsString = get(URI.create(LEGACY_RSD_ORGANISATION_URI));
		JsonArray allOrganisationsFromLegacyRSD = JsonParser.parseString(allOrganisationsString).getAsJsonArray();
		Map<String, String> organisationKeyToName = createOrganisationKeyToName(allOrganisationsFromLegacyRSD);
		saveContributors(allPersonsFromLegacyRSD, allSoftwareFromLegacyRSD, slugToIdSoftware, organisationKeyToName, "contributors", "/contributor", "software");
		saveSoftwareRelatedToSoftware(allSoftwareFromLegacyRSD, legacyIdToNewIdSoftware);
		saveTestimonialsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware);

		String allProjectsString = get(URI.create(LEGACY_RSD_PROJECT_URI));
		JsonArray allProjectsFromLegacyRSD = JsonParser.parseString(allProjectsString).getAsJsonArray();
		saveProjects(allProjectsFromLegacyRSD);
		Map<String, String> slugToIdProject = slugToId("/project?select=id,slug");
		saveTagsForProjects(allProjectsFromLegacyRSD, slugToIdProject);
		saveTopicsForProjects(allProjectsFromLegacyRSD, slugToIdProject);
		Map<String, String> legacyIdToNewIdProject = idToId(allProjectsFromLegacyRSD, slugToIdProject);
		saveProjectImages(allProjectsFromLegacyRSD);
		saveSoftwareRelatedToProjects(allSoftwareFromLegacyRSD, slugToIdSoftware, legacyIdToNewIdProject);
		saveProjectsRelatedToProjects(allProjectsFromLegacyRSD, legacyIdToNewIdProject);
		saveContributors(allPersonsFromLegacyRSD, allProjectsFromLegacyRSD, slugToIdProject, null, "team", "/team_member", "project");

		String allMentionsString = get(URI.create(LEGACY_RSD_MENTION_URI));
		JsonArray allMentionsFromLegacyRSD = JsonParser.parseString(allMentionsString).getAsJsonArray();
		saveMentions(allMentionsFromLegacyRSD);
		Map<String, String> legacyMentionIdToId = legacyMentionIdToId(allMentionsFromLegacyRSD);
		saveMentionsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware, legacyMentionIdToId);
		saveImpactAndOutputForProjects(allProjectsFromLegacyRSD, slugToIdProject, legacyMentionIdToId);

		String allReleasesString = get(URI.create(LEGACY_RSD_RELEASE_URI));
		JsonArray allReleasesFromLegacyRSD = JsonParser.parseString(allReleasesString).getAsJsonArray();
		Map<String, String> conceptDoiToSoftwareId = conceptDoiToSoftwareId(allSoftwareFromLegacyRSD, slugToIdSoftware);
		saveReleases(allReleasesFromLegacyRSD, conceptDoiToSoftwareId);
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
				getPostgREST(URI.create(POSTGREST_URI + "/"));
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

	public static JsonElement jsonNullIfEquals(JsonElement element, String... content) {
		if (element == null || element.isJsonNull()) return JsonNull.INSTANCE;
		if (Arrays.stream(content).anyMatch(s -> element.getAsString().equals(s))) return JsonNull.INSTANCE;
		return element;
	}

	public static void saveSoftware(JsonArray allSoftwareFromLegacyRSD) {
		JsonArray allSoftwareToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareToSave = new JsonObject();
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

			softwareToSave.add("slug", softwareFromLegacyRSD.get("slug"));
			softwareToSave.add("brand_name", softwareFromLegacyRSD.get("brandName"));
			softwareToSave.add("concept_doi", jsonNullIfEquals(softwareFromLegacyRSD.get("conceptDOI"), "10.0000/FIXME"));
			softwareToSave.add("description", mergeBulletsReadMore(softwareFromLegacyRSD.get("bullets"), softwareFromLegacyRSD.get("readMore")));
			softwareToSave.add("get_started_url", softwareFromLegacyRSD.get("getStartedURL"));
			softwareToSave.add("is_featured", softwareFromLegacyRSD.get("isFeatured"));
			softwareToSave.add("is_published", softwareFromLegacyRSD.get("isPublished"));
			softwareToSave.add("short_statement", softwareFromLegacyRSD.get("shortStatement"));

//			see the comments at saveRepoUrls(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId)
			JsonArray urls = softwareFromLegacyRSD.get("repositoryURLs").getAsJsonObject().get("github").getAsJsonArray();
			if (urls.size() > 1) {
				JsonElement existingDescriptionJson = softwareToSave.get("description");
				String existingDescription = existingDescriptionJson.isJsonNull() ? "" : existingDescriptionJson.getAsString();
				existingDescription += existingDescription.equals("") ? "Additional repositories:" : "\n\nAdditional repositories:";
				for (int i = 1; i < urls.size(); i++) {
					existingDescription += "\n* " + urls.get(i).getAsJsonPrimitive().getAsString();
				}
				softwareToSave.addProperty("description", existingDescription);
			}

			allSoftwareToSave.add(softwareToSave);
		});
		post(URI.create(POSTGREST_URI + "/software"), allSoftwareToSave.toString());
	}

	public static JsonElement mergeBulletsReadMore(JsonElement bullets, JsonElement readMore) {
		if ((bullets == null || bullets.isJsonNull()) && (readMore == null || readMore.isJsonNull())) {
			return JsonNull.INSTANCE;
		} else if (bullets == null || bullets.isJsonNull()) {
			return readMore;
		} else if (readMore == null || readMore.isJsonNull()) {
			return bullets;
		} else {
			return new JsonPrimitive(bullets.getAsString() + "\n\n" + readMore.getAsString());
		}
	}

	public static Map<String, String> slugToId(String endpoint) {
		JsonArray savedEntities = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + endpoint))).getAsJsonArray();
		Map<String, String> slugToId = new HashMap<>();
		savedEntities.forEach(jsonElement -> {
			String slug = jsonElement.getAsJsonObject().get("slug").getAsString();
			String id = jsonElement.getAsJsonObject().get("id").getAsString();
			slugToId.put(slug, id);
		});
		return slugToId;
	}

	public static Map<String, String> idToId(JsonArray entities, Map<String, String> slugToId) {
		Map<String, String> idToId = new HashMap<>();
		entities.forEach(jsonElement -> {
			String idLegacy = jsonElement.getAsJsonObject().getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String slug = jsonElement.getAsJsonObject().getAsJsonPrimitive("slug").getAsString();
			String idNew = slugToId.get(slug);
			idToId.put(idLegacy, idNew);
		});
		return idToId;
	}

	public static void saveRepoUrls(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
//		unfortunately, PostgREST doesn't allow for patching or posting when using resource embedding,
//		therefore, we need to get the just saved software id's in order to populate the repository_url table
		JsonArray allRepoUrlsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple urls is with slug vantage6
//			the only element in the object "repositoryURLs" is "github"
			JsonArray urls = softwareFromLegacyRSD.get("repositoryURLs").getAsJsonObject().get("github").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
//			we only save the first url, the rest we add to the description of the software
			if (urls.size() > 0) {
				JsonElement jsonUrl = urls.get(0);
				JsonObject repoUrlToSave = new JsonObject();
				repoUrlToSave.addProperty("software", slugToId.get(slug));
				repoUrlToSave.add("url", jsonUrl);
				allRepoUrlsToSave.add(repoUrlToSave);
			}
		});
		post(URI.create(POSTGREST_URI + "/repository_url"), allRepoUrlsToSave.toString());
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
		post(URI.create(POSTGREST_URI + "/license_for_software"), allLicensesToSave.toString());
	}

	public static void saveTagsForSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
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
		post(URI.create(POSTGREST_URI + "/tag_for_software"), allTagsToSave.toString());
	}

	public static Map<String, String> createOrganisationKeyToName(JsonArray allOrganisationsFromLegacyRSD) {
		Map<String, String> result = new HashMap<>();
		for (JsonElement jsonElement : allOrganisationsFromLegacyRSD) {
			JsonObject organisation = jsonElement.getAsJsonObject();
			String key = organisation.getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String name = organisation.getAsJsonPrimitive("name").getAsString();
			if (result.containsKey(key)) {
				throw new RuntimeException("Duplicate organisation key found: " + key);
			}
			result.put(key, name);
		}
		return result;
	}

	public static void saveContributors(JsonArray allPersonsFromLegacyRSD, JsonArray allEntitiesFromLegacyRSD, Map<String, String> slugToId, Map<String, String> organisationKeyToName, String personKey, String endpoint, String relationKey) {
//		TODO: affiliations from contributors? YES, mapping to ROR possible?
//		each person has an id, we need to find the person given this id since the software api only lists the id's
		Map<String, JsonObject> personIdToObject = new HashMap<>();
		allPersonsFromLegacyRSD.forEach(jsonPerson -> {
			String id = jsonPerson.getAsJsonObject().getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			if (personIdToObject.containsKey(id)) throw new RuntimeException("Duplicate id for person exists: " + id);
			personIdToObject.put(id, jsonPerson.getAsJsonObject());
		});

		JsonArray allContributorsToSave = new JsonArray();
		allEntitiesFromLegacyRSD.forEach(jsonEntity -> {
			JsonObject entityFromLegacyRSD = jsonEntity.getAsJsonObject();
			String slug = entityFromLegacyRSD.getAsJsonPrimitive("slug").getAsString();
			String entityId = slugToId.get(slug);

			JsonArray contributorsForEntity = entityFromLegacyRSD.getAsJsonArray(personKey);
			contributorsForEntity.forEach(jsonContributor -> {
				JsonObject contributorFromLegacyRSD = jsonContributor.getAsJsonObject();
				JsonObject contributorToSave = new JsonObject();

				contributorToSave.addProperty(relationKey, entityId);
				contributorToSave.add("is_contact_person", contributorFromLegacyRSD.get("isContactPerson"));
				String personId = contributorFromLegacyRSD.getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				JsonObject personData = personIdToObject.get(personId);
				contributorToSave.add("email_address", nullIfBlank(personData.get("emailAddress")));
				String familyNames = personData.getAsJsonPrimitive("familyNames").getAsString();
				JsonElement nameParticleJson = personData.get("nameParticle");
				if (!(nameParticleJson == null || nameParticleJson.isJsonNull())) {
					String nameParticle = nameParticleJson.getAsString().strip();
					if (!nameParticle.isEmpty()) {
						familyNames = nameParticle + " " + familyNames;
					}
				}
				contributorToSave.addProperty("family_names", familyNames);
				contributorToSave.add("given_names", personData.get("givenNames"));
//				we skip the name suffix, as there are currently no valid entries in the legacy RSD
//				contributorToSave.add("name_suffix", nullIfBlank(personData.get("nameSuffix")));

				if (organisationKeyToName != null) {
					JsonArray affiliations = contributorFromLegacyRSD.getAsJsonArray("affiliations");
					Set<String> allAffiliations = new HashSet<>();
					for (JsonElement affiliation : affiliations) {
						String organisationKey = affiliation.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
						String affiliationName = organisationKeyToName.get(organisationKey);
						if (affiliationName == null) {
							throw new RuntimeException("No organisation name found for key " + organisationKey + " for contributor " + contributorFromLegacyRSD);
						}
						allAffiliations.add(affiliationName);
					}
					if (allAffiliations.isEmpty()) {
						contributorToSave.add("affiliation", JsonNull.INSTANCE);
					} else {
						contributorToSave.addProperty("affiliation", String.join(", ", allAffiliations));
					}
				}

				if (personData.has("avatar")) {
					contributorToSave.add("avatar_data", personData.getAsJsonObject("avatar").get("data"));
					contributorToSave.add("avatar_mime_type", personData.getAsJsonObject("avatar").get("mimeType"));
				} else {
					contributorToSave.add("avatar_data", JsonNull.INSTANCE);
					contributorToSave.add("avatar_mime_type", JsonNull.INSTANCE);
				}

				allContributorsToSave.add(contributorToSave);
			});
		});
		post(URI.create(POSTGREST_URI + endpoint), allContributorsToSave.toString());
	}

	public static JsonElement nullIfBlank(JsonElement jsonString) {
		if (jsonString == null || jsonString.isJsonNull()) return JsonNull.INSTANCE;
		String stringToCheck = jsonString.getAsString();
		if (stringToCheck.isBlank()) return JsonNull.INSTANCE;
		else return jsonString;
	}

	public static void saveSoftwareRelatedToSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> legacyIdToNewIdSoftware) {
		JsonArray allRelationsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonSoftware -> {
			JsonObject legacySoftware = jsonSoftware.getAsJsonObject();
			String idOriginLegacy = legacySoftware.getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String idOriginNew = legacyIdToNewIdSoftware.get(idOriginLegacy);
			legacySoftware.getAsJsonObject("related").getAsJsonArray("software").forEach(jsonRelated -> {
				String idRelationLegacy = jsonRelated.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String idRelationNew = legacyIdToNewIdSoftware.get(idRelationLegacy);
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("origin", idOriginNew);
				relationToSave.addProperty("relation", idRelationNew);
				allRelationsToSave.add(relationToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/software_for_software"), allRelationsToSave.toString());
	}

	public static void saveTestimonialsForSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allTestimonialsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple testimonials is with slug ggir
			JsonArray testimonials = softwareFromLegacyRSD.get("testimonials").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
			testimonials.forEach(jsonMention -> {
				JsonObject testimonialToSave = new JsonObject();
				testimonialToSave.addProperty("software", slugToId.get(slug));
				JsonElement personJson = jsonMention.getAsJsonObject().get("person");
				JsonElement affiliationJson = jsonMention.getAsJsonObject().get("affiliation");
				JsonElement sourceJson;
				if ((personJson == null || personJson.isJsonNull()) && (affiliationJson == null || affiliationJson.isJsonNull())) {
					sourceJson = JsonNull.INSTANCE;
				} else if (personJson == null || personJson.isJsonNull()) {
					sourceJson = affiliationJson;
				} else if (affiliationJson == null || affiliationJson.isJsonNull()) {
					sourceJson = personJson;
				} else {
					sourceJson = new JsonPrimitive(personJson.getAsString() + ", " + affiliationJson.getAsString());
				}
				testimonialToSave.add("source", sourceJson);
				testimonialToSave.add("message", jsonMention.getAsJsonObject().getAsJsonPrimitive("text"));
				allTestimonialsToSave.add(testimonialToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/testimonial"), allTestimonialsToSave.toString());
	}

	public static void saveProjects(JsonArray allProjectsFromLegacyRSD) {
		JsonArray allProjectsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectToSave = new JsonObject();
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			projectToSave.add("slug", projectFromLegacyRSD.get("slug"));
			projectToSave.add("call_url", jsonNullIfEquals(projectFromLegacyRSD.get("callUrl"), "https://doi.org/FIXME"));
			projectToSave.add("code_url", jsonNullIfEquals(projectFromLegacyRSD.get("codeUrl"), "https://github.com/FIXME"));
			projectToSave.add("data_management_plan_url", jsonNullIfEquals(projectFromLegacyRSD.get("dataManagementPlanUrl"), "https://doi.org/FIXME"));
			projectToSave.add("date_end", projectFromLegacyRSD.get("dateEnd"));
			projectToSave.add("date_start", projectFromLegacyRSD.get("dateStart"));
			projectToSave.add("description", projectFromLegacyRSD.get("description"));
			projectToSave.add("grant_id", jsonNullIfEquals(projectFromLegacyRSD.get("grantId"), "FIXME", "https://doi.org/FIXME"));
			projectToSave.add("home_url", jsonNullIfEquals(projectFromLegacyRSD.get("homeUrl"), "https://doi.org/FIXME"));
			projectToSave.add("image_caption", jsonNullIfEquals(projectFromLegacyRSD.get("imageCaption"), "captionFIXME"));
			projectToSave.add("is_published", projectFromLegacyRSD.get("isPublished"));
			projectToSave.add("software_sustainability_plan_url", projectFromLegacyRSD.get("softwareSustainabilityPlanUrl"));
			projectToSave.add("subtitle", projectFromLegacyRSD.get("subtitle"));
			projectToSave.add("title", projectFromLegacyRSD.get("title"));
			allProjectsToSave.add(projectToSave);
		});
		post(URI.create(POSTGREST_URI + "/project"), allProjectsToSave.toString());
	}

	public static void saveTagsForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allTagsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			JsonArray tags = projectFromLegacyRSD.get("technologies").getAsJsonArray();
			String slug = projectFromLegacyRSD.get("slug").getAsString();
			tags.forEach(jsonTag -> {
				JsonObject tagToSave = new JsonObject();
				tagToSave.addProperty("project", slugToId.get(slug));
				tagToSave.add("tag", jsonTag);
				allTagsToSave.add(tagToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/tag_for_project"), allTagsToSave.toString());
	}

	public static void saveTopicsForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allTopicsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			JsonArray tags = projectFromLegacyRSD.get("topics").getAsJsonArray();
			String slug = projectFromLegacyRSD.get("slug").getAsString();
			tags.forEach(jsonTopic -> {
				JsonObject topicToSave = new JsonObject();
				topicToSave.addProperty("project", slugToId.get(slug));
				topicToSave.add("topic", jsonTopic);
				allTopicsToSave.add(topicToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/topic_for_project"), allTopicsToSave.toString());
	}

	public static void saveProjectImages(JsonArray allProjectsFromLegacyRSD) {
		JsonArray savedProjects = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/project?select=id,slug"))).getAsJsonArray();
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
		post(URI.create(POSTGREST_URI + "/image_for_project"), allImagesToSave.toString());
	}

	public static void saveSoftwareRelatedToProjects(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToIdSoftware, Map<String, String> legacyIdToNewIdProject) {
		JsonArray allRelationsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonSoftware -> {
			JsonObject legacySoftware = jsonSoftware.getAsJsonObject();
			String slugSoftware = legacySoftware.getAsJsonPrimitive("slug").getAsString();
			String idSoftwareNew = slugToIdSoftware.get(slugSoftware);
			legacySoftware.getAsJsonObject("related").getAsJsonArray("projects").forEach(jsonRelated -> {
				String idProjectLegacy = jsonRelated.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String idProjectNew = legacyIdToNewIdProject.get(idProjectLegacy);
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("software", idSoftwareNew);
				relationToSave.addProperty("project", idProjectNew);
				allRelationsToSave.add(relationToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/software_for_project"), allRelationsToSave.toString());
	}

	public static void saveProjectsRelatedToProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> legacyIdToNewIdProject) {
		JsonArray allRelationsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonProject -> {
			JsonObject legacyProject = jsonProject.getAsJsonObject();
			String idOriginLegacy = legacyProject.getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String idOriginNew = legacyIdToNewIdProject.get(idOriginLegacy);
			legacyProject.getAsJsonObject("related").getAsJsonArray("projects").forEach(jsonRelated -> {
				String idRelationLegacy = jsonRelated.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String idRelationNew = legacyIdToNewIdProject.get(idRelationLegacy);
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("origin", idOriginNew);
				relationToSave.addProperty("relation", idRelationNew);
				allRelationsToSave.add(relationToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/project_for_project"), allRelationsToSave.toString());
	}

	public static void saveMentions(JsonArray allMentionsFromLegacyRSD) {
		JsonArray allMentionsToSave = new JsonArray();
		allMentionsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject mentionToSave = new JsonObject();
			JsonObject mentionFromLegacyRSD = jsonElement.getAsJsonObject();

			mentionToSave.add("author", mentionFromLegacyRSD.get("author"));
			mentionToSave.add("date", mentionFromLegacyRSD.get("date"));
			mentionToSave.add("image", mentionFromLegacyRSD.get("image"));
			mentionToSave.add("is_featured", mentionFromLegacyRSD.get("isCorporateBlog"));
			mentionToSave.add("title", mentionFromLegacyRSD.get("title"));
			mentionToSave.add("type", mentionFromLegacyRSD.get("type"));
			mentionToSave.add("url", mentionFromLegacyRSD.get("url"));
			mentionToSave.add("version", mentionFromLegacyRSD.get("version"));
			mentionToSave.add("zotero_key", mentionFromLegacyRSD.get("zoteroKey"));

			allMentionsToSave.add(mentionToSave);
		});
		post(URI.create(POSTGREST_URI + "/mention"), allMentionsToSave.toString());
	}

	public static Map<String, String> legacyMentionIdToId(JsonArray allMentionsFromLegacyRSD) {
//		So we have a problem here: how to uniquely identify a mention?
//		This is needed to retrieve the primary key for a mention after it is saved in Postgres.
//		Unfortunately, title is not unique, zotero_key can be null.
//		Luckily, the combination of title and zotero_key is unique at the time of writing.
//		We throw an exception if this is not the case in the future.
		JsonArray savedMentions = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/mention?select=id,title,zotero_key"))).getAsJsonArray();
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

		Map<String, String> result = new HashMap<>();
		legacyIdToRecord.forEach((legacyId, mentionRecord) -> result.put(legacyId, mentionToId.get(mentionRecord)));
		return result;
	}

	public static void saveMentionsForSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId, Map<String, String> legacyMentionIdToId) {
		JsonArray allMentionsForSoftwareToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(legacySoftware -> {
			String slug = legacySoftware.getAsJsonObject().getAsJsonPrimitive("slug").getAsString();
			legacySoftware.getAsJsonObject().getAsJsonObject("related").getAsJsonArray("mentions").forEach(legacyMention -> {
				String legacyId = legacyMention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String newId = legacyMentionIdToId.get(legacyId);
				JsonObject mentionForSoftwareToSave = new JsonObject();
				mentionForSoftwareToSave.addProperty("mention", newId);
				mentionForSoftwareToSave.addProperty("software", slugToId.get(slug));
				allMentionsForSoftwareToSave.add(mentionForSoftwareToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/mention_for_software"), allMentionsForSoftwareToSave.toString());
	}

	public static void saveImpactAndOutputForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToId, Map<String, String> legacyMentionIdToId) {
		JsonArray outputForProjectsToSave = new JsonArray();
		JsonArray impactForProjectsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonProject -> {
			JsonObject projectObject = jsonProject.getAsJsonObject();
			String id = slugToId.get(projectObject.getAsJsonPrimitive("slug").getAsString());

			JsonArray outputLegacy = projectObject.getAsJsonArray("output");
			outputLegacy.forEach(mention -> {
				String legacyId = mention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String newId = legacyMentionIdToId.get(legacyId);
				JsonObject outputToSave = new JsonObject();
				outputToSave.addProperty("mention", newId);
				outputToSave.addProperty("project", id);
				outputForProjectsToSave.add(outputToSave);
			});

			JsonArray impactLegacy = projectObject.getAsJsonArray("impact");
			impactLegacy.forEach(mention -> {
				String legacyId = mention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String newId = legacyMentionIdToId.get(legacyId);
				JsonObject impactToSave = new JsonObject();
				impactToSave.addProperty("mention", newId);
				impactToSave.addProperty("project", id);
				impactForProjectsToSave.add(impactToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/output_for_project"), outputForProjectsToSave.toString());
		post(URI.create(POSTGREST_URI + "/impact_for_project"), impactForProjectsToSave.toString());
	}

	public static Map<String, String> conceptDoiToSoftwareId(JsonArray entityArray, Map<String, String> slugToId) {
		Map<String, String> conceptDoiToSoftwareId = new HashMap<>();
		entityArray.forEach(entity -> {
			JsonElement conceptDoiElement = entity.getAsJsonObject().get("conceptDOI");
			if (conceptDoiElement == null || conceptDoiElement.isJsonNull()) return;
			String conceptDoi = conceptDoiElement.getAsString();
			if (conceptDoi.equals("10.0000/FIXME"))
				return; // problematic entry as it is not unique, luckily no release uses it
//			problematic entry as it has two software-entries, corrected manually
			if (conceptDoi.equals("10.5281/zenodo.3964180")) {
				String handPickedSlug = "gh-action-set-up-singularity";
				String handPickedId = slugToId.get(handPickedSlug);
				conceptDoiToSoftwareId.put(conceptDoi, handPickedId);
				return;
			}

			String slug = entity.getAsJsonObject().getAsJsonPrimitive("slug").getAsString();
			String id = slugToId.get(slug);
			if (conceptDoiToSoftwareId.containsKey(conceptDoi))
				throw new RuntimeException("Concept DOI " + conceptDoi + " is not unique");
			conceptDoiToSoftwareId.put(conceptDoi, id);
		});
		return conceptDoiToSoftwareId;
	}

	public static void saveReleases(JsonArray allReleasesFromLegacyRSD, Map<String, String> conceptDoiToSoftwareId) {
		JsonArray allReleasesToSave = new JsonArray();
		allReleasesFromLegacyRSD.forEach(jsonRelease -> {
			JsonObject legacyRelease = jsonRelease.getAsJsonObject();
			JsonObject releaseToSave = new JsonObject();

			String legacyConceptDoi = legacyRelease.get("conceptDOI").getAsString();
//			some problematic entries, corrected manually:
			if (legacyConceptDoi.equals("10.5281/zenodo.3563088"))
				return; // matching conceptDOI 10.5281/zenodo.883726 is already present
			if (legacyConceptDoi.equals("10.5281/zenodo.3630355"))
				return; // matching conceptDOI 10.5281/zenodo.3630354 is already present
			if (legacyConceptDoi.equals("10.5281/zenodo.3686602"))
				return; // matching conceptDOI 10.5281/zenodo.3686601 is already present
			if (legacyConceptDoi.equals("10.5281/zenodo.3716378"))
				return; // this is a valid conceptDOI, but conceptDOI 10.5281/zenodo.3859772 seems to be the same content but is newer and is present in the legacy RSD, see also https://zenodo.org/record/3834230 and https://zenodo.org/record/5717374
			if (legacyConceptDoi.equals("10.5281/zenodo.3889758"))
				return; // matching conceptDOI 10.5281/zenodo.3859772 is already present
			if (legacyConceptDoi.equals("10.5281/zenodo.3889772"))
				return; // matching conceptDOI 10.5281/zenodo.3889771 not present in legacy RSD, proposed solution was to ignore it
			if (legacyConceptDoi.equals("10.5281/zenodo.4336539"))
				return; // matching conceptDOI 10.5281/zenodo.4336538 is already present
			if (legacyConceptDoi.equals("10.5281/zenodo.4590883"))
				return; // matching conceptDOI 10.5281/zenodo.4590882 is already present
			if (conceptDoiToSoftwareId.get(legacyConceptDoi) == null) {
				return;
			}
			releaseToSave.addProperty("software", conceptDoiToSoftwareId.get(legacyConceptDoi));
			releaseToSave.add("is_citable", legacyRelease.get("isCitable"));
			releaseToSave.add("latest_schema_dot_org", legacyRelease.get("latestSchema_dot_org"));
			allReleasesToSave.add(releaseToSave);
		});
		post(URI.create(POSTGREST_URI + "/release"), allReleasesToSave.toString());

//		we can use the saved foreign key to software to uniquely identify a release
		JsonArray savedReleases = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/release"))).getAsJsonArray();
		Map<String, String> softwareIdToReleaseId = new HashMap<>();
		savedReleases.forEach(savedRelease -> {
			String releaseId = savedRelease.getAsJsonObject().getAsJsonPrimitive("id").getAsString();
			String softwareId = savedRelease.getAsJsonObject().getAsJsonPrimitive("software").getAsString();
			softwareIdToReleaseId.put(softwareId, releaseId);
		});

		JsonArray allReleaseContentsToSave = new JsonArray();
		allReleasesFromLegacyRSD.forEach(jsonRelease -> {
			JsonObject legacyRelease = jsonRelease.getAsJsonObject();
			JsonArray allReleaseContentsFromLegacyRSD = legacyRelease.getAsJsonArray("releases");
			String conceptDoi = legacyRelease.getAsJsonPrimitive("conceptDOI").getAsString();
			String softwareId = conceptDoiToSoftwareId.get(conceptDoi);
			String releaseId = softwareIdToReleaseId.get(softwareId);
			if (releaseId == null) return;

			allReleaseContentsFromLegacyRSD.forEach(releaseContentJson -> {
				JsonObject legacyReleaseContent = releaseContentJson.getAsJsonObject();
				JsonObject releaseContentToSave = new JsonObject();

				releaseContentToSave.addProperty("release_id", releaseId);
				releaseContentToSave.add("citability", legacyReleaseContent.get("citability"));
				releaseContentToSave.add("date_published", legacyReleaseContent.get("datePublished"));
				releaseContentToSave.add("doi", legacyReleaseContent.get("doi"));
				releaseContentToSave.add("tag", legacyReleaseContent.get("tag"));
				releaseContentToSave.add("url", legacyReleaseContent.get("url"));

				releaseContentToSave.add("bibtex", legacyReleaseContent.getAsJsonObject("files").get("bibtex"));
				releaseContentToSave.add("cff", legacyReleaseContent.getAsJsonObject("files").get("cff"));
				releaseContentToSave.add("codemeta", legacyReleaseContent.getAsJsonObject("files").get("codemeta"));
				releaseContentToSave.add("endnote", legacyReleaseContent.getAsJsonObject("files").get("endnote"));
				releaseContentToSave.add("ris", legacyReleaseContent.getAsJsonObject("files").get("ris"));
				releaseContentToSave.add("schema_dot_org", legacyReleaseContent.getAsJsonObject("files").get("schema_dot_org"));
				allReleaseContentsToSave.add(releaseContentToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/release_content"), allReleaseContentsToSave.toString());
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

	public static String getPostgREST(URI uri) {
		HttpRequest request = HttpRequest.newBuilder()
				.GET()
				.uri(uri)
				.header("Authorization", "Bearer " + jwtString)
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
				.header("Authorization", "Bearer " + jwtString)
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
