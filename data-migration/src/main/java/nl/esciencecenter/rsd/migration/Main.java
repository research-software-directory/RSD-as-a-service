// SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.migration;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.Normalizer;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

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

	public static final String LEGACY_ID_NLESC = "nlesc";

	public static final Collection<String> invalidUrls = Set.of("https://doi.org/FIXME", "https://FIXME", "https://.",
			"https://TODO", "https://doi.org/.", "https://doi.org/TODO", "https://github.com/", "http://FIXME",
			"https://doi.org/todo", "https://github.com/FIXME", "https://doi.org/PLACEHOLDER", "https://doi.org/",
			"https://github.com/TODO");

	public static final Collection<String> softwareSlugsToFeature = new HashSet<>();
	public static final Map<String, String> collapsedOrgNames = new HashMap<>();

	public static void main(String[] args) {
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
		Map<String, String> keywordToId = keywordToId();
		saveKeywordsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware, keywordToId);
		String allPersonsString = get(URI.create(LEGACY_RSD_PERSON_URI));
		JsonArray allPersonsFromLegacyRSD = JsonParser.parseString(allPersonsString).getAsJsonArray();
		String allOrganisationsString = get(URI.create(LEGACY_RSD_ORGANISATION_URI));
		JsonArray allOrganisationsFromLegacyRSD = JsonParser.parseString(allOrganisationsString).getAsJsonArray();
		Map<String, String> organisationKeyToName = createOrganisationKeyToName(allOrganisationsFromLegacyRSD);
		savePeople(allPersonsFromLegacyRSD, allSoftwareFromLegacyRSD, slugToIdSoftware, organisationKeyToName, "contributors", "/contributor", "software");
		saveSoftwareRelatedToSoftware(allSoftwareFromLegacyRSD, legacyIdToNewIdSoftware);
		saveTestimonialsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware);

		String allProjectsString = get(URI.create(LEGACY_RSD_PROJECT_URI));
		JsonArray allProjectsFromLegacyRSD = JsonParser.parseString(allProjectsString).getAsJsonArray();
		saveProjects(allProjectsFromLegacyRSD);
		Map<String, String> slugToIdProject = slugToId("/project?select=id,slug");
		saveUrlsForProjects(allProjectsFromLegacyRSD, slugToIdProject);
		saveKeywordsForProjects(allProjectsFromLegacyRSD, slugToIdProject, keywordToId);
		Map<String, String> researchDomainToId = researchDomainToId();
		saveResearchDomainsForProjects(allProjectsFromLegacyRSD, slugToIdProject, researchDomainToId);
		Map<String, String> legacyIdToNewIdProject = idToId(allProjectsFromLegacyRSD, slugToIdProject);
		saveProjectImages(allProjectsFromLegacyRSD);
		saveSoftwareRelatedToProjects(allSoftwareFromLegacyRSD, slugToIdSoftware, legacyIdToNewIdProject);
		saveProjectsRelatedToProjects(allProjectsFromLegacyRSD, legacyIdToNewIdProject);
		savePeople(allPersonsFromLegacyRSD, allProjectsFromLegacyRSD, slugToIdProject, organisationKeyToName, "team", "/team_member", "project");

		String allMentionsString = get(URI.create(LEGACY_RSD_MENTION_URI));
		JsonArray allMentionsFromLegacyRSD = JsonParser.parseString(allMentionsString).getAsJsonArray();
		sanitiseMentions(allMentionsFromLegacyRSD);
		saveMentions(allMentionsFromLegacyRSD);
		Map<String, String> legacyMentionIdToId = legacyMentionIdToId(allMentionsFromLegacyRSD);
		saveMentionsForSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware, legacyMentionIdToId);
		saveImpactAndOutputForProjects(allProjectsFromLegacyRSD, slugToIdProject, legacyMentionIdToId);

		String allReleasesString = get(URI.create(LEGACY_RSD_RELEASE_URI));
		JsonArray allReleasesFromLegacyRSD = JsonParser.parseString(allReleasesString).getAsJsonArray();
		Map<String, String> conceptDoiToSoftwareId = conceptDoiToSoftwareId(allSoftwareFromLegacyRSD, slugToIdSoftware);
		saveReleases(allReleasesFromLegacyRSD, conceptDoiToSoftwareId);

		Map<String, OrgData> slugToOrgData = parseOrgCsv();
		saveOrganisations(allOrganisationsFromLegacyRSD, slugToOrgData);
		Map<String, String> orgNameToId = orgNameToId();
		saveOrganisationLogos(allOrganisationsFromLegacyRSD, orgNameToId);
		Map<String, String> legacyOrgIdToId = idToIdOrg(allOrganisationsFromLegacyRSD, orgNameToId, collapsedOrgNames);
		saveOrganisationsRelatedToSoftware(allSoftwareFromLegacyRSD, slugToIdSoftware, legacyOrgIdToId);
		saveProjectsRelatedToSoftware(allProjectsFromLegacyRSD, slugToIdProject, legacyOrgIdToId);
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
			JsonElement possibleGetStartedUrl = softwareFromLegacyRSD.get("getStartedURL");
			if (possibleGetStartedUrl.isJsonPrimitive() && possibleGetStartedUrl.getAsString().equals("url://pyzacros.readthedocs.io/en/latest/")) {
				possibleGetStartedUrl = new JsonPrimitive("https://pyzacros.readthedocs.io/en/latest/");
			} else if (possibleGetStartedUrl.isJsonPrimitive() && possibleGetStartedUrl.getAsString().isBlank()) {
				possibleGetStartedUrl = JsonNull.INSTANCE;
			}
			softwareToSave.add("get_started_url", possibleGetStartedUrl);
			if (softwareFromLegacyRSD.get("isFeatured").getAsBoolean()) softwareSlugsToFeature.add(softwareFromLegacyRSD.get("slug").getAsString());
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
				String url = jsonUrl.getAsString();
				if (url.startsWith("https://github.com")) repoUrlToSave.addProperty("code_platform", "github");
				else if (url.contains("gitlab")) repoUrlToSave.addProperty("code_platform", "gitlab");
				else if (url.contains("bitbucket")) repoUrlToSave.addProperty("code_platform", "bitbucket");
				else repoUrlToSave.addProperty("code_platform", "other");
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

	public static void saveKeywordsForSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToIdSoftware, Map<String, String> keywordToId) {
		JsonArray allKeywordsToSave = new JsonArray();
		allSoftwareFromLegacyRSD.forEach(jsonElement -> {
			JsonObject softwareFromLegacyRSD = jsonElement.getAsJsonObject();

//			an example of an entry with multiple tags is with slug ahn2webviewer
			JsonArray tags = softwareFromLegacyRSD.get("tags").getAsJsonArray();
			String slug = softwareFromLegacyRSD.get("slug").getAsString();
			tags.forEach(jsonTag -> {
				JsonObject keywordSoftwareRelationToSave = new JsonObject();
				keywordSoftwareRelationToSave.addProperty("software", slugToIdSoftware.get(slug));
				String keyword = jsonTag.getAsString();
				String keywordId = Objects.requireNonNull(keywordToId.get(keyword), "Unknown keyword found: " + keyword);
				keywordSoftwareRelationToSave.addProperty("keyword", keywordId);
				allKeywordsToSave.add(keywordSoftwareRelationToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/keyword_for_software"), allKeywordsToSave.toString());
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

	public static void savePeople(JsonArray allPersonsFromLegacyRSD, JsonArray allEntitiesFromLegacyRSD, Map<String, String> slugToId, Map<String, String> organisationKeyToName, String personKey, String endpoint, String relationKey) {
//		TODO: affiliations from contributors? YES, mapping to ROR possible?
//		each person has an id, we need to find the person given this id since the software api only lists the id's
		Map<String, JsonObject> personIdToObject = new HashMap<>();
		allPersonsFromLegacyRSD.forEach(jsonPerson -> {
			String id = jsonPerson.getAsJsonObject().getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			if (personIdToObject.containsKey(id)) throw new RuntimeException("Duplicate id for person exists: " + id);
			personIdToObject.put(id, jsonPerson.getAsJsonObject());
		});

		JsonArray allPeopleToSave = new JsonArray();
		allEntitiesFromLegacyRSD.forEach(jsonEntity -> {
			JsonObject entityFromLegacyRSD = jsonEntity.getAsJsonObject();
			String slug = entityFromLegacyRSD.getAsJsonPrimitive("slug").getAsString();
			String entityId = slugToId.get(slug);

			JsonArray contributorsForEntity = entityFromLegacyRSD.getAsJsonArray(personKey);
			contributorsForEntity.forEach(jsonContributor -> {
				JsonObject personFromLegacyRSD = jsonContributor.getAsJsonObject();
				JsonObject personToSave = new JsonObject();

				personToSave.addProperty(relationKey, entityId);
				personToSave.add("is_contact_person", personFromLegacyRSD.get("isContactPerson"));
				String personId = personFromLegacyRSD.getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				JsonObject personData = personIdToObject.get(personId);
				personToSave.add("email_address", nullIfBlank(personData.get("emailAddress")));
				String familyNames = personData.getAsJsonPrimitive("familyNames").getAsString();
				JsonElement nameParticleJson = personData.get("nameParticle");
				if (!(nameParticleJson == null || nameParticleJson.isJsonNull())) {
					String nameParticle = nameParticleJson.getAsString().strip();
					if (!nameParticle.isEmpty()) {
						familyNames = nameParticle + " " + familyNames;
					}
				}
				personToSave.addProperty("family_names", familyNames);
				personToSave.add("given_names", personData.get("givenNames"));
//				we skip the name suffix, as there are currently no valid entries in the legacy RSD
//				contributorToSave.add("name_suffix", nullIfBlank(personData.get("nameSuffix")));

				JsonElement roleJson = personFromLegacyRSD.get("role");
				if (roleJson != null && !roleJson.isJsonNull()) {
					personToSave.add("role", roleJson);
				}

				if (organisationKeyToName != null) {
					JsonArray affiliations = personFromLegacyRSD.getAsJsonArray("affiliations");
					Set<String> allAffiliations = new HashSet<>();
					for (JsonElement affiliation : affiliations) {
						String organisationKey = affiliation.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
						String affiliationName = organisationKeyToName.get(organisationKey);
						if (affiliationName == null) {
							throw new RuntimeException("No organisation name found for key " + organisationKey + " for person " + personFromLegacyRSD);
						}
						allAffiliations.add(affiliationName);
					}
					if (allAffiliations.isEmpty()) {
						personToSave.add("affiliation", JsonNull.INSTANCE);
					} else {
						personToSave.addProperty("affiliation", String.join(", ", allAffiliations));
					}
				}

				if (personData.has("avatar")) {
					personToSave.add("avatar_data", personData.getAsJsonObject("avatar").get("data"));
					personToSave.add("avatar_mime_type", personData.getAsJsonObject("avatar").get("mimeType"));
				} else {
					personToSave.add("avatar_data", JsonNull.INSTANCE);
					personToSave.add("avatar_mime_type", JsonNull.INSTANCE);
				}

				allPeopleToSave.add(personToSave);
			});
		});
		post(URI.create(POSTGREST_URI + endpoint), allPeopleToSave.toString());
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
			projectToSave.add("date_end", projectFromLegacyRSD.get("dateEnd"));
			projectToSave.add("date_start", projectFromLegacyRSD.get("dateStart"));
			projectToSave.add("description", projectFromLegacyRSD.get("description"));
			projectToSave.add("grant_id", jsonNullIfEquals(projectFromLegacyRSD.get("grantId"), "FIXME", "https://doi.org/FIXME"));
			projectToSave.add("image_caption", jsonNullIfEquals(projectFromLegacyRSD.get("imageCaption"), "captionFIXME"));
			projectToSave.add("is_published", projectFromLegacyRSD.get("isPublished"));
			projectToSave.add("subtitle", projectFromLegacyRSD.get("subtitle"));
			projectToSave.add("title", projectFromLegacyRSD.get("title"));
			allProjectsToSave.add(projectToSave);
		});
		post(URI.create(POSTGREST_URI + "/project"), allProjectsToSave.toString());
	}

	public static Map<String, String> keywordToId() {
		JsonArray keywordsArray = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/keyword"))).getAsJsonArray();
		Map<String, String> result = new HashMap<>();
		for (JsonElement jsonElement : keywordsArray) {
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			String keyword = jsonObject.getAsJsonPrimitive("value").getAsString();
			String id = jsonObject.getAsJsonPrimitive("id").getAsString();
			result.put(keyword, id);
		}
		return result;
	}

	public static Map<String, String> researchDomainToId() {
		JsonArray researchDomainsArray = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/research_domain"))).getAsJsonArray();
		Map<String, String> result = new HashMap<>();
		for (JsonElement jsonElement : researchDomainsArray) {
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			String researchDomain = jsonObject.getAsJsonPrimitive("key").getAsString();
			String id = jsonObject.getAsJsonPrimitive("id").getAsString();
			result.put(researchDomain, id);
		}
		return result;
	}

	public static void saveUrlsForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToId) {
		JsonArray allProjectUrlsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();
			String slug = projectFromLegacyRSD.getAsJsonPrimitive("slug").getAsString();
			String projectId = slugToId.get(slug);

			JsonElement callUrl = projectFromLegacyRSD.get("callUrl");
			validUrl(callUrl).ifPresent(url -> addUrlToArray(allProjectUrlsToSave, projectId, "Call document", url));

			JsonElement codeUrl = projectFromLegacyRSD.get("codeUrl");
			validUrl(codeUrl).ifPresent(url -> addUrlToArray(allProjectUrlsToSave, projectId, "Code repository", url));

			JsonElement dataManagementPlanUrl = projectFromLegacyRSD.get("dataManagementPlanUrl");
			validUrl(dataManagementPlanUrl).ifPresent(url -> addUrlToArray(allProjectUrlsToSave, projectId, "Data management plan", url));

			JsonElement homeUrl = projectFromLegacyRSD.get("homeUrl");
			validUrl(homeUrl).ifPresent(url -> addUrlToArray(allProjectUrlsToSave, projectId, "Project website", url));

			JsonElement softwareSustainabilityPlanUrl = projectFromLegacyRSD.get("softwareSustainabilityPlanUrl");
			validUrl(softwareSustainabilityPlanUrl).ifPresent(url -> addUrlToArray(allProjectUrlsToSave, projectId, "Software sustainability plan", url));
		});
		post(URI.create(POSTGREST_URI + "/url_for_project"), allProjectUrlsToSave.toString());
	}

	public static Optional<String> validUrl(JsonElement jsonUrl) {
		if (jsonUrl == null || jsonUrl.isJsonNull()) return Optional.empty();
		String url = jsonUrl.getAsJsonPrimitive().getAsString();
		return invalidUrls.contains(url) ? Optional.empty() : Optional.of(url);
	}

	public static void addUrlToArray(JsonArray array, String projectId, String title, String url) {
		JsonObject urlToAdd = new JsonObject();
		urlToAdd.addProperty("project", projectId);
		urlToAdd.addProperty("title", title);
		urlToAdd.addProperty("url", url);
		array.add(urlToAdd);
	}

	public static void saveKeywordsForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToIdProject, Map<String, String> keywordToId) {
		JsonArray allKeywordsToSave = new JsonArray();
		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			JsonArray technologies = projectFromLegacyRSD.get("technologies").getAsJsonArray();
			String slug = projectFromLegacyRSD.get("slug").getAsString();
			technologies.forEach(jsonTechnology -> {
				JsonObject keywordProjectRelationToSave = new JsonObject();
				keywordProjectRelationToSave.addProperty("project", slugToIdProject.get(slug));
				String keyword = jsonTechnology.getAsString();
				String keywordId = Objects.requireNonNull(keywordToId.get(keyword), "Unknown keyword found: " + keyword);
				keywordProjectRelationToSave.addProperty("keyword", keywordId);
				allKeywordsToSave.add(keywordProjectRelationToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/keyword_for_project"), allKeywordsToSave.toString());
	}

	public static void saveResearchDomainsForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToIdProject, Map<String, String> researchDomainToId) {
		Map<String, String> oldDomainToNew = new HashMap<>();
		oldDomainToNew.put("Astronomy", "PE9");
		oldDomainToNew.put("Chemistry", "PE");
		oldDomainToNew.put("Climate and weather", "PE10");
		oldDomainToNew.put("Computer science", "PE6");
		oldDomainToNew.put("Ecology", "LS8");
		oldDomainToNew.put("Health", "LS");
		oldDomainToNew.put("Humanities", "SH");
		oldDomainToNew.put("Law", "SH2");
		oldDomainToNew.put("Life science", "LS");
		oldDomainToNew.put("Material science", "PE");
		oldDomainToNew.put("Physics", "PE");
		oldDomainToNew.put("Psychology", "SH4");
		oldDomainToNew.put("Social sciences", "SH");

//		Since some old domains map to the same new domain, we have to make sure the relations we save are unique,
//		otherwise the database will reject the request
		record DomainProject(String newDomainId, String projectId) {}
		Set<DomainProject> uniqueDomainProjectRelations = new HashSet<>();

		allProjectsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject projectFromLegacyRSD = jsonElement.getAsJsonObject();

			JsonArray topics = projectFromLegacyRSD.get("topics").getAsJsonArray();
			String slug = projectFromLegacyRSD.get("slug").getAsString();
			topics.forEach(jsonResearchDomain -> {
				String projectId = slugToIdProject.get(slug);
				String oldResearchDomain = jsonResearchDomain.getAsString();
				String newResearchDomain = Objects.requireNonNull(oldDomainToNew.get(oldResearchDomain), "Unknown old research domain found: " + oldResearchDomain);
				String newResearchDomainId = Objects.requireNonNull(researchDomainToId.get(newResearchDomain), "Unknown new research domain found: " + newResearchDomain);
				uniqueDomainProjectRelations.add(new DomainProject(newResearchDomainId, projectId));
			});
		});

		JsonArray allResearchDomainsToSave = new JsonArray();
		for (DomainProject uniqueDomainProjectRelation : uniqueDomainProjectRelations) {
			JsonObject researchDomainToSave = new JsonObject();
			researchDomainToSave.addProperty("project", uniqueDomainProjectRelation.projectId);
			researchDomainToSave.addProperty("research_domain", uniqueDomainProjectRelation.newDomainId);
			allResearchDomainsToSave.add(researchDomainToSave);
		}
		post(URI.create(POSTGREST_URI + "/research_domain_for_project"), allResearchDomainsToSave.toString());
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
			JsonElement imageDataJson = imageFromLegacyRSD.get("data");
			if (imageDataJson == null || imageDataJson.isJsonNull() || imageDataJson.getAsString().isBlank()) return;
			imageToSave.add("data", imageDataJson);
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

	public static String nullOrValue(JsonElement jsonElement) {
		return jsonElement == null || jsonElement.isJsonNull() || !jsonElement.isJsonPrimitive() ? null :
				jsonElement.getAsString();
	}

	public static void sanitiseMentions(JsonArray legacyMentions) {
		Iterable<JsonObject> legacyMentionsAsObjects = (Iterable) legacyMentions;
		for (JsonObject legacyMention : legacyMentionsAsObjects) {
			String oldType = legacyMention.get("type").getAsString();
			String newType = replaceType(oldType);
			if (legacyMention.get("isCorporateBlog").getAsBoolean()) newType = "highlight";
			legacyMention.addProperty("type", newType);

			String oldUrl = nullOrValue(legacyMention.get("url"));
			String newUrl = fixDoi(oldUrl);
			if (newUrl != null) {
				if (newUrl.equals("Histoinformatics")) newUrl = null;
				else if (newUrl.equals("viz.icaci.org/vcma2016/")) {
					newUrl = "https://" + newUrl;
				} else if (newUrl.equals("www.digitalhumanities.org/dhq/vol/8/1/000176/000176.html")) {
					newUrl = "http://" + newUrl;
				}
			}
			legacyMention.addProperty("url", newUrl);
		}
	}

	public static void saveMentions(JsonArray allMentionsFromLegacyRSD) {
		JsonArray allMentionsToSave = new JsonArray();
		Set<String> usedDois = new HashSet<>();
		allMentionsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject mentionToSave = new JsonObject();
			JsonObject mentionFromLegacyRSD = jsonElement.getAsJsonObject();
			mentionToSave.add("authors", mentionFromLegacyRSD.get("author"));
			mentionToSave.add("image_url", mentionFromLegacyRSD.get("image"));
			ZonedDateTime oldDate = ZonedDateTime.parse(mentionFromLegacyRSD.get("date").getAsString());
			int year = oldDate.getYear();
			mentionToSave.addProperty("publication_year", year);
			mentionToSave.addProperty("source", "manual");
			mentionToSave.add("title", mentionFromLegacyRSD.get("title"));
			mentionToSave.add("mention_type", mentionFromLegacyRSD.get("type"));
			String url = nullOrValue(mentionFromLegacyRSD.get("url"));
			if (url != null && url.startsWith("https://doi.org/")) {
				String doi = url.replaceFirst("https://doi\\.org/", "");
				if (usedDois.contains(doi)) return;
				usedDois.add(doi);
				mentionToSave.addProperty("doi", doi);
			} else {
				mentionToSave.add("doi", JsonNull.INSTANCE);
			}
			mentionToSave.addProperty("url", url);

			allMentionsToSave.add(mentionToSave);
		});
		post(URI.create(POSTGREST_URI + "/mention"), allMentionsToSave.toString());
	}

	public static String replaceType(String type) {
		Set<String> typesThatShouldBeOther = Set.of("attachment", "document", "manuscript", "note", "radioBroadcast");
		return typesThatShouldBeOther.contains(type) ? "other" : type;
	}

	public static String fixDoi(String url) {
		if (url != null && url.startsWith("https://doi.org/0")) {
			url = url.replaceFirst("https://doi\\.org/0", "https://doi.org/10");
		}
		if (url != null && url.startsWith("https://doi.org/ ")) {
			url = url.replaceFirst("https://doi\\.org/ ", "https://doi.org/");
		}
		return url;
	}

	public static Map<String, String> legacyMentionIdToId(JsonArray allMentionsFromLegacyRSD) {
//		So we have a problem here: how to uniquely identify a mention?
//		This is needed to retrieve the primary key for a mention after it is saved in Postgres.
//		We first see if there is a matching DOI to obtain the new id, since DOIs have to be unique.
//		Otherwise, we use the fields authors,image_url,mention_type,url,title.
//		If we cannot map an old id to a new id, we throw an exception.
		JsonArray savedMentions = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/mention?select=id,authors,image_url,mention_type,url,title,doi"))).getAsJsonArray();
		Map<MentionRecord, String> mentionToId = new HashMap<>();
		Map<String, String> doiToId = new HashMap<>();
		savedMentions.forEach(jsonMention -> {
			String id = jsonMention.getAsJsonObject().getAsJsonPrimitive("id").getAsString();
			String title = jsonMention.getAsJsonObject().getAsJsonPrimitive("title").getAsString();
			String author = stringOrNull(jsonMention.getAsJsonObject().get("authors"));
			String image_url = stringOrNull(jsonMention.getAsJsonObject().get("image_url"));
			String mention_type = jsonMention.getAsJsonObject().get("mention_type").getAsString();
			String url = stringOrNull(jsonMention.getAsJsonObject().get("url"));
			mentionToId.put(new MentionRecord(title, author, image_url, mention_type, url), id);
			JsonElement possibleDoi = jsonMention.getAsJsonObject().get("doi");
			if (possibleDoi.isJsonPrimitive()) doiToId.put(possibleDoi.getAsString(), id);
		});

		Map<String, String> result = new HashMap<>();
		for (JsonElement legacyMention : allMentionsFromLegacyRSD) {
			JsonObject legacyMentionObject = legacyMention.getAsJsonObject();
			String legacyId = legacyMentionObject.getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String legacyTitle = legacyMentionObject.getAsJsonPrimitive("title").getAsString();
			String legacyAuthor = stringOrNull(legacyMentionObject.get("author"));
			String legacyImageUrl = stringOrNull(legacyMentionObject.get("image"));
			String legacyMentionType = legacyMentionObject.getAsJsonPrimitive("type").getAsString();
			String legacyUrl = stringOrNull(legacyMentionObject.get("url"));
			if (legacyUrl != null && legacyUrl.startsWith("https://doi.org/")) {
				String doi = legacyUrl.replaceFirst("https://doi\\.org/", "");
				if (!doiToId.containsKey(doi)) throw new RuntimeException("We couldn't map legacy mention with id " + legacyId + " to a new id");
				result.put(legacyId, doiToId.get(doi));
			}
			else {
				MentionRecord legacyMentionRecord = new MentionRecord(legacyTitle, legacyAuthor, legacyImageUrl, legacyMentionType, legacyUrl);
				if (!mentionToId.containsKey(legacyMentionRecord)) throw new RuntimeException("We couldn't map legacy mention with id " + legacyId + " to a new id");
				result.put(legacyId, mentionToId.get(legacyMentionRecord));
			}
		}
		return result;
	}

	public static void saveMentionsForSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToId, Map<String, String> legacyMentionIdToId) {
		JsonArray allMentionsForSoftwareToSave = new JsonArray();
		Set<MentionRelationRecord> usedRelations = new HashSet<>();
		allSoftwareFromLegacyRSD.forEach(legacySoftware -> {
			String slug = legacySoftware.getAsJsonObject().getAsJsonPrimitive("slug").getAsString();
			legacySoftware.getAsJsonObject().getAsJsonObject("related").getAsJsonArray("mentions").forEach(legacyMention -> {
				String legacyId = legacyMention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String newId = legacyMentionIdToId.get(legacyId);
				JsonObject mentionForSoftwareToSave = new JsonObject();
				mentionForSoftwareToSave.addProperty("mention", newId);
				mentionForSoftwareToSave.addProperty("software", slugToId.get(slug));
				MentionRelationRecord mentionRelationRecord = new MentionRelationRecord(newId, slugToId.get(slug));
				if (usedRelations.contains(mentionRelationRecord)) return;
				usedRelations.add(mentionRelationRecord);
				allMentionsForSoftwareToSave.add(mentionForSoftwareToSave);
			});
		});
		post(URI.create(POSTGREST_URI + "/mention_for_software"), allMentionsForSoftwareToSave.toString());
	}

	public static void saveImpactAndOutputForProjects(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToId, Map<String, String> legacyMentionIdToId) {
		JsonArray outputForProjectsToSave = new JsonArray();
		Set<MentionRelationRecord> usedOutputRelations = new HashSet<>();
		JsonArray impactForProjectsToSave = new JsonArray();
		Set<MentionRelationRecord> usedImpactRelations = new HashSet<>();
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
				MentionRelationRecord mentionRelationRecord = new MentionRelationRecord(newId, id);
				if (usedOutputRelations.contains(mentionRelationRecord)) return;
				usedOutputRelations.add(mentionRelationRecord);
				outputForProjectsToSave.add(outputToSave);
			});

			JsonArray impactLegacy = projectObject.getAsJsonArray("impact");
			impactLegacy.forEach(mention -> {
				String legacyId = mention.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				String newId = legacyMentionIdToId.get(legacyId);
				JsonObject impactToSave = new JsonObject();
				impactToSave.addProperty("mention", newId);
				impactToSave.addProperty("project", id);
				MentionRelationRecord mentionRelationRecord = new MentionRelationRecord(newId, id);
				if (usedImpactRelations.contains(mentionRelationRecord)) return;
				usedImpactRelations.add(mentionRelationRecord);
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

	static class OrgData {
		public String slug;
		public String name;
		public String website;
		public String rorId;
		public String comment;

		public OrgData(String slug, String name, String website, String rorId, String comment) {
			this.slug = slug;
			this.name = name;
			this.website = website;
			this.rorId = rorId;
			this.comment = comment;
		}
	}

	public static Map<String, OrgData> parseOrgCsv() {
		Map<String, OrgData> slugToOrgData = new HashMap<>();
		try {
			Scanner orgCsvScanner = new Scanner(new File("src/main/resources/organisation_202207011308.csv"));
			// first line is the header
			orgCsvScanner.nextLine();
			while (orgCsvScanner.hasNext()) {
				String orgLine = orgCsvScanner.nextLine();
				String[] orgDataArray = orgLine.split(";");
				if (orgDataArray.length != 5 && orgDataArray.length != 4) {
					throw new RuntimeException("Unexpected length: " + orgDataArray.length + ", line is: " + orgLine);
				}
				String slug = orgDataArray[0].isBlank() ? null : orgDataArray[0].replace("\"", "");
				String name = orgDataArray[1].isBlank() ? null : orgDataArray[1].replace("\"", "");
				String website = orgDataArray[2].isBlank() ? null : orgDataArray[2].replace("\"", "");
				String rorId = orgDataArray[3].isBlank() ? null : orgDataArray[3].replace("\"", "");
//				if there is no comment, the line ends with a delimiter and the split function doesn't
//				consider the comment part to be an empty string
				String comment = orgDataArray.length == 5 ? orgDataArray[4].replace("\"", "") : null;

				OrgData orgData = new OrgData(slug, name, website, rorId, comment);
				slugToOrgData.put(slug, orgData);
			}
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		}
		return slugToOrgData;
	}

	public static void saveOrganisations(JsonArray allOrganisationsFromLegacyRSD, Map<String, OrgData> slugToOrgData) {
		Map<String, String> usedRorIdsToName = new HashMap<>();
		JsonArray allOrganisationsToSave = new JsonArray();
		Set<String> existingNames = new HashSet<>();
		Set<String> existingSlugs = new HashSet<>();
		Set<String> existingWebsites = new HashSet<>();
		allOrganisationsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject organisationToSave = new JsonObject();
			JsonObject organisationFromLegacyRSD = jsonElement.getAsJsonObject();

			String name = organisationFromLegacyRSD.getAsJsonPrimitive("name").getAsString();
			if (name.equals("FUGRO")) return;
			if (name.equals("Koninklijk Nederlands Meteorologisch Instituut") && existingNames.contains(name)) return;
			if (name.equals("Software for Chemicals & Materials") && existingNames.contains(name)) return;
			if (existingNames.contains(name)) {
				System.out.println("Warning, double name found (" + name + "), skipping");
				return;
			}
			existingNames.add(name);

			String slug = Normalizer.normalize(name, Normalizer.Form.NFD);
			slug = slug
					.strip()
					.toLowerCase()
					.replaceAll("[^a-z0-9 -]", "")
					.replace(' ', '-')
					.replaceAll("-+", "-");

			if (existingSlugs.contains(slug)) {
				System.out.println("Warning, double slug found (" + slug + "), skipping");
				return;
			}
			existingSlugs.add(slug);

			organisationToSave.addProperty("slug", slug);
			organisationToSave.addProperty("name", name);

			if (name.equals("ECMWF")) {
				organisationToSave.addProperty("website", "https://www.ecmwf.int/");
			} else {
				String website = organisationFromLegacyRSD.getAsJsonPrimitive("url").getAsString();
				if (existingWebsites.contains(website)) {
					System.out.println("Warning, double website found (" + website + "), skipping");
					return;
				}
				if (website.equals("https://FIXME")) website = null;
				organisationToSave.addProperty("website", website);
				if (website != null) existingWebsites.add(website);
			}

			String rorId = slugToOrgData.get(slug).rorId;
			if (usedRorIdsToName.containsKey(rorId)) {
				collapsedOrgNames.put(name, usedRorIdsToName.get(rorId));
				return;
			}
			if (rorId != null) usedRorIdsToName.put(rorId, name);
			organisationToSave.addProperty("ror_id", rorId);
			allOrganisationsToSave.add(organisationToSave);
		});
		post(URI.create(POSTGREST_URI + "/organisation"), allOrganisationsToSave.toString());
	}

	public static Map<String, String> orgNameToId() {
		JsonArray savedOrganisations = JsonParser.parseString(getPostgREST(URI.create(POSTGREST_URI + "/organisation"))).getAsJsonArray();
		Map<String, String> nameToId = new HashMap<>();
		savedOrganisations.forEach(jsonElement -> {
			String name = jsonElement.getAsJsonObject().get("name").getAsString();
			String id = jsonElement.getAsJsonObject().get("id").getAsString();
			nameToId.put(name, id);
		});
		nameToId.put("FUGRO", nameToId.get("Fugro"));
		return nameToId;
	}

	public static void saveOrganisationLogos(JsonArray allOrganisationsFromLegacyRSD, Map<String, String> orgNameToId) {
		JsonArray allLogosToSave = new JsonArray();
		Set<String> existingIds = new HashSet<>();
		allOrganisationsFromLegacyRSD.forEach(jsonElement -> {
			JsonObject logoToSave = new JsonObject();
			JsonObject organisationFromLegacyRSD = jsonElement.getAsJsonObject();

			JsonElement possibleLogo = organisationFromLegacyRSD.get("logo");
			if (possibleLogo == null || possibleLogo.isJsonNull()) return;
			JsonObject logo = possibleLogo.getAsJsonObject();
			String name = organisationFromLegacyRSD.getAsJsonPrimitive("name").getAsString();
			if (name.equals("FUGRO")) return;

			String orgId = orgNameToId.get(name);
			if (orgId == null) return;
			if (existingIds.contains(orgId)) return;

			logoToSave.addProperty("organisation", orgId);
			String possibleImageData = stringOrNull(logo.get("data"));
			if (possibleImageData == null || possibleImageData.isBlank()) return;
			logoToSave.addProperty("data", possibleImageData);
			logoToSave.add("mime_type", logo.get("mimeType"));
			existingIds.add(orgNameToId.get(name));

			allLogosToSave.add(logoToSave);
		});
		post(URI.create(POSTGREST_URI + "/logo_for_organisation"), allLogosToSave.toString());
	}

	public static Map<String, String> idToIdOrg(JsonArray allOrganisationsFromLegacyRSD, Map<String, String> nameToId, Map<String, String> collapsedOrgNames) {
		Map<String, String> idToId = new HashMap<>();
		allOrganisationsFromLegacyRSD.forEach(jsonElement -> {
			String idLegacy = jsonElement.getAsJsonObject().getAsJsonObject("primaryKey").getAsJsonPrimitive("id").getAsString();
			String name = jsonElement.getAsJsonObject().getAsJsonPrimitive("name").getAsString();
			if (collapsedOrgNames.containsKey(name)) name = collapsedOrgNames.get(name);
			String idNew = nameToId.get(name);
			idToId.put(idLegacy, idNew);
		});
		return idToId;
	}

	public static void saveOrganisationsRelatedToSoftware(JsonArray allSoftwareFromLegacyRSD, Map<String, String> slugToIdSoftware, Map<String, String> legacyOrgIdToId) {
		JsonArray allRelationsToSave = new JsonArray();
		String newIdNlesc = legacyOrgIdToId.get(LEGACY_ID_NLESC);
		allSoftwareFromLegacyRSD.forEach(jsonSoftware -> {
			JsonObject legacySoftware = jsonSoftware.getAsJsonObject();
			String slugSoftware = legacySoftware.getAsJsonPrimitive("slug").getAsString();
			String idSoftwareNew = slugToIdSoftware.get(slugSoftware);
			AtomicBoolean isNlescRelated = new AtomicBoolean(false);
			legacySoftware.getAsJsonObject("related").getAsJsonArray("organizations").forEach(jsonOrganisation -> {
				String idOrganisationLegacy = jsonOrganisation.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				if (idOrganisationLegacy.equals(LEGACY_ID_NLESC)) isNlescRelated.set(true);
				String idOrganisationNew = legacyOrgIdToId.get(idOrganisationLegacy);
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("software", idSoftwareNew);
				relationToSave.addProperty("organisation", idOrganisationNew);
				relationToSave.addProperty("is_featured", idOrganisationLegacy.equals(LEGACY_ID_NLESC) && softwareSlugsToFeature.contains(slugSoftware));
				allRelationsToSave.add(relationToSave);
			});
			if (!isNlescRelated.get()) {
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("software", idSoftwareNew);
				relationToSave.addProperty("organisation", newIdNlesc);
				relationToSave.addProperty("is_featured", softwareSlugsToFeature.contains(slugSoftware));
				allRelationsToSave.add(relationToSave);
			}
		});
		System.out.println();
		post(URI.create(POSTGREST_URI + "/software_for_organisation"), allRelationsToSave.toString());
	}

	public static void saveProjectsRelatedToSoftware(JsonArray allProjectsFromLegacyRSD, Map<String, String> slugToIdProject, Map<String, String> legacyOrgIdToId) {
		JsonArray allRelationsToSave = new JsonArray();
		String newIdNlesc = legacyOrgIdToId.get(LEGACY_ID_NLESC);
		allProjectsFromLegacyRSD.forEach(jsonProject -> {
			JsonObject legacyProject = jsonProject.getAsJsonObject();
			String slugProject = legacyProject.getAsJsonPrimitive("slug").getAsString();
			String idProjectNew = slugToIdProject.get(slugProject);
			AtomicBoolean isNlescRelated = new AtomicBoolean(false);
			legacyProject.getAsJsonObject("related").getAsJsonArray("organizations").forEach(jsonOrganisation -> {
				String idOrganisationLegacy = jsonOrganisation.getAsJsonObject().getAsJsonObject("foreignKey").getAsJsonPrimitive("id").getAsString();
				if (idOrganisationLegacy.equals(LEGACY_ID_NLESC)) isNlescRelated.set(true);
				String idOrganisationNew = legacyOrgIdToId.get(idOrganisationLegacy);
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("project", idProjectNew);
				relationToSave.addProperty("organisation", idOrganisationNew);
				allRelationsToSave.add(relationToSave);
			});
			if (!isNlescRelated.get()) {
				JsonObject relationToSave = new JsonObject();
				relationToSave.addProperty("project", idProjectNew);
				relationToSave.addProperty("organisation", newIdNlesc);
				allRelationsToSave.add(relationToSave);
			}
		});
		post(URI.create(POSTGREST_URI + "/project_for_organisation"), allRelationsToSave.toString());
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

	public static String stringOrNull(JsonElement element) {
		if (element == null || element.isJsonNull()) return null;
		if (element.isJsonPrimitive()) return element.getAsString();
		throw new RuntimeException("Element is of unexpected type, its contents is: " + element);
	}
}
