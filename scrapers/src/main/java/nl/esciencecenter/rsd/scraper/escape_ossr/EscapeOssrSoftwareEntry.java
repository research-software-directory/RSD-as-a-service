// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.escape_ossr;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import nl.esciencecenter.rsd.scraper.RsdContributor;
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import nl.esciencecenter.rsd.scraper.Utils;
import nl.esciencecenter.rsd.scraper.doi.Doi;
import nl.esciencecenter.rsd.scraper.git.CodePlatformProvider;
import nl.esciencecenter.rsd.scraper.license.SpdxLicense;

public class EscapeOssrSoftwareEntry {

	private static final Pattern ORCID_PATTERN = Pattern.compile("\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]");

	final String name;
	final Doi conceptDoi;
	final String description;
	final Optional<String> readmeUrl;
	final String repoUrl;
	final CodePlatformProvider codePlatform;
	final List<String> keywords;
	final List<RsdContributor> contributors;
	final Optional<String> license;

	private EscapeOssrSoftwareEntry(
		String name,
		Doi conceptDoi,
		String description,
		Optional<String> readmeUrl,
		String repoUrl,
		CodePlatformProvider codePlatform,
		List<String> keywords,
		List<RsdContributor> contributors,
		Optional<String> license
	) {
		this.name = name;
		this.conceptDoi = conceptDoi;
		this.description = description;
		this.readmeUrl = readmeUrl;
		this.repoUrl = repoUrl;
		this.codePlatform = codePlatform;
		this.keywords = keywords;
		this.contributors = contributors;
		this.license = license;
	}

	public static EscapeOssrSoftwareEntry fromCodemeta(String codemeta, Doi conceptDoi) throws RsdParsingException {
		try {
			JsonObject root = JsonParser.parseString(codemeta).getAsJsonObject();

			String name = root.getAsJsonPrimitive("name").getAsString();
			String description = root.getAsJsonPrimitive("description").getAsString();
			Optional<String> readmeUrl = Optional.empty();
			JsonElement readmeJson = root.get("readme");
			if (readmeJson != null && readmeJson.isJsonPrimitive()) {
				String readmeUrlToCheck = readmeJson.getAsJsonPrimitive().getAsString();
				if (Utils.isUrl(readmeUrlToCheck)) {
					readmeUrl = Optional.of(readmeUrlToCheck);
				}
			}

			String repoUrl = root.getAsJsonPrimitive("codeRepository").getAsString();
			if (repoUrl.startsWith("git+")) {
				repoUrl = repoUrl.substring(4);
			}
			if (repoUrl.endsWith(".git")) {
				repoUrl = repoUrl.substring(0, repoUrl.length() - 4);
			}
			CodePlatformProvider codePlatform = CodePlatformProvider.OTHER;
			if (repoUrl.startsWith("https://github.com")) {
				codePlatform = CodePlatformProvider.GITHUB;
			} else if (repoUrl.contains("gitlab")) {
				codePlatform = CodePlatformProvider.GITLAB;
			} else if (
				repoUrl.startsWith("https://git.ligo.org") ||
				repoUrl.startsWith("https://git.astron.nl") ||
				repoUrl.startsWith("https://baltig.infn.it")
			) {
				codePlatform = CodePlatformProvider.GITLAB;
			}

			JsonElement keywordsJson = root.get("keywords");
			List<String> keywords = new ArrayList<>();
			if (keywordsJson != null && keywordsJson.isJsonArray()) {
				for (JsonElement keywordJson : keywordsJson.getAsJsonArray()) {
					keywords.add(keywordJson.getAsString());
				}
			}

			List<RsdContributor> contributors = new ArrayList<>();
			contributors.addAll(parseContributorArray(root.get("author"), 1));
			contributors.addAll(parseContributorArray(root.get("contributor"), contributors.size() + 1));
			contributors.addAll(parseContributorArray(root.get("maintainer"), contributors.size() + 1));

			Optional<String> license = Optional.empty();
			JsonElement licenseJson = root.get("license");
			if (licenseJson != null && licenseJson.isJsonPrimitive()) {
				license = Optional.of(licenseJson.getAsString());
			}

			return new EscapeOssrSoftwareEntry(
				name,
				conceptDoi,
				description,
				readmeUrl,
				repoUrl,
				codePlatform,
				keywords,
				contributors,
				license
			);
		} catch (RuntimeException e) {
			throw new RsdParsingException("Could no parse codemeta", e);
		}
	}

	private static List<RsdContributor> parseContributorArray(JsonElement element, int startPosition) {
		if (element == null || !element.isJsonArray()) {
			return Collections.emptyList();
		}

		JsonArray array = element.getAsJsonArray();
		List<RsdContributor> result = new ArrayList<>(array.size());

		for (JsonElement jsonElement : array) {
			JsonObject authorObject = jsonElement.getAsJsonObject();
			if (!authorObject.getAsJsonPrimitive("@type").getAsString().equals("Person")) {
				continue;
			}

			String givenNames = authorObject.getAsJsonPrimitive("givenName").getAsString();
			String familyNames = authorObject.getAsJsonPrimitive("familyName").getAsString();

			Optional<String> affiliation = Optional.empty();
			if (authorObject.get("affiliation") instanceof JsonPrimitive affiliationJson) {
				affiliation = Optional.of(affiliationJson.getAsString());
			} else if (authorObject.get("affiliation") instanceof JsonObject affiliationJson) {
				affiliation = Optional.of(affiliationJson.getAsJsonPrimitive("name").getAsString());
			}

			Optional<String> orcid = parseOrcid(authorObject.get("@id"));
			if (orcid.isEmpty()) {
				orcid = parseOrcid(authorObject.get("identifier"));
			}

			RsdContributor contributor = new RsdContributor(givenNames, familyNames, affiliation, orcid, startPosition);
			++startPosition;
			result.add(contributor);
		}

		return result;
	}

	private static Optional<String> parseOrcid(JsonElement element) {
		if (element == null || !element.isJsonPrimitive()) {
			return Optional.empty();
		}

		Matcher orcidMatcher = ORCID_PATTERN.matcher(element.getAsString());
		if (orcidMatcher.find()) {
			return Optional.of(orcidMatcher.group(0));
		}

		return Optional.empty();
	}

	public String toRsdJson(Map<String, SpdxLicense> licenseMap) {
		JsonObject root = new JsonObject();
		root.addProperty("community_slug", "escape-ossr");
		root.addProperty("slug", Utils.slugify(name));
		root.addProperty("brand_name", name);
		root.addProperty("concept_doi", conceptDoi.toString());
		root.addProperty(
			"short_statement",
			description.length() > 300 ? description.substring(0, 297) + "..." : description
		);
		root.addProperty("description", description);
		root.addProperty("get_started_url", readmeUrl.orElse(null));

		root.addProperty("repository_url", repoUrl);
		root.addProperty("code_platform", codePlatform.toDatabaseString());
		root.add("scraping_disabled_reason", JsonNull.INSTANCE);

		JsonArray keywordsArray = new JsonArray(keywords.size());
		for (String keyword : keywords) {
			keywordsArray.add((keyword));
		}
		root.add("keywords_array", keywordsArray);

		JsonArray familyNamesArray = new JsonArray(contributors.size());
		JsonArray givenNamesArray = new JsonArray(contributors.size());
		JsonArray roleArray = new JsonArray(contributors.size());
		JsonArray affiliationArray = new JsonArray(contributors.size());
		JsonArray orcidArray = new JsonArray(contributors.size());
		JsonArray positionArray = new JsonArray(contributors.size());

		for (RsdContributor contributor : contributors) {
			familyNamesArray.add(contributor.familyNames());
			givenNamesArray.add(contributor.givenNames());
			affiliationArray.add(contributor.affiliation().map(Utils::sanitiseWhitespace).orElse(null));
			roleArray.add(JsonNull.INSTANCE);
			orcidArray.add(contributor.orcid().orElse(null));
			positionArray.add(contributor.position());
		}

		if (license.isPresent()) {
			String rawLicense = license.get();
			Optional<SpdxLicense> optionalSpdxLicense = extractSpdxLicense(rawLicense, licenseMap);
			if (optionalSpdxLicense.isPresent()) {
				SpdxLicense spdxLicense = optionalSpdxLicense.get();

				root.addProperty("license_value", spdxLicense.licenseId());
				root.addProperty("license_name", spdxLicense.name());
				root.addProperty("license_url", spdxLicense.reference());
				root.addProperty("license_open_source", true);
			} else {
				root.add("license_value", JsonNull.INSTANCE);
				root.add("license_name", JsonNull.INSTANCE);
				root.add("license_url", JsonNull.INSTANCE);
				root.add("license_open_source", JsonNull.INSTANCE);
			}
		}

		root.add("family_names_array", familyNamesArray);
		root.add("given_names_array", givenNamesArray);
		root.add("affiliation_array", affiliationArray);
		root.add("role_array", roleArray);
		root.add("orcid_array", orcidArray);
		root.add("position_array", positionArray);

		root.add("related_modules", new JsonArray());
		root.add("categories", new JsonObject());
		root.add("regular_mentions", new JsonArray());

		return root.toString();
	}

	Optional<SpdxLicense> extractSpdxLicense(String rawLicense, Map<String, SpdxLicense> licenseMap) {
		if (rawLicense == null) {
			return Optional.empty();
		}

		if (licenseMap.containsKey(rawLicense)) {
			return Optional.of(licenseMap.get(rawLicense));
		}

		String urlPrefix = "https://spdx.org/licenses/";
		if (!rawLicense.startsWith(urlPrefix)) {
			return Optional.empty();
		}

		String spdxId = rawLicense.substring(urlPrefix.length());
		return Optional.ofNullable(licenseMap.get(spdxId));
	}
}
