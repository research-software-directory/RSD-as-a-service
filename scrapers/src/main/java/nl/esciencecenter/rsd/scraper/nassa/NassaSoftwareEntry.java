// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.nassa;

import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import nl.esciencecenter.rsd.scraper.doi.ExternalMentionRecord;
import nl.esciencecenter.rsd.scraper.doi.PostgrestMentionRepository;
import nl.esciencecenter.rsd.scraper.license.SpdxLicense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.Reader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class NassaSoftwareEntry {

	private static final Logger LOGGER = LoggerFactory.getLogger(NassaSoftwareEntry.class);

	final String gitHtmlUrl;
	final String id;
	final String nassaVersion;
	final String moduleType;
	final String title;
	final String moduleVersion;
	final List<NassaContributor> contributors;
	final String license;
	final Date lastUpdateDate;
	final String shortDescription;
	final String longDescription;
	final List<String> relatedModules;
	final Map<String, List<String>> references;
	final Map<String, List<String>> domainKeywords;
	final List<String> modellingKeywords;
	final List<String> programmingKeywords;
	final List<Map<String, Object>> implementations;
	final String docsDir;
	final List<Map<String, String>> inputs;
	final List<Map<String, String>> outputs;

	private NassaSoftwareEntry(
		String gitHtmlUrl,
		String id,
		String nassaVersion,
		String moduleType,
		String title,
		String moduleVersion,
		List<NassaContributor> contributors,
		String license,
		Date lastUpdateDate,
		String shortDescription,
		String longDescription,
		List<String> relatedModules,
		Map<String, List<String>> references,
		Map<String, List<String>> domainKeywords,
		List<String> modellingKeywords,
		List<String> programmingKeywords,
		List<Map<String, Object>> implementations,
		String docsDir,
		List<Map<String, String>> inputs,
		List<Map<String, String>> outputs
	) {
		this.gitHtmlUrl = gitHtmlUrl;
		this.id = id;
		this.nassaVersion = nassaVersion;
		this.moduleType = moduleType;
		this.title = title;
		this.moduleVersion = moduleVersion;
		this.contributors = contributors;
		this.license = license;
		this.lastUpdateDate = lastUpdateDate;
		this.shortDescription = shortDescription;
		this.longDescription = longDescription;
		this.relatedModules = relatedModules;
		this.references = references;
		this.domainKeywords = Objects.requireNonNull(domainKeywords);
		this.modellingKeywords = modellingKeywords;
		this.programmingKeywords = programmingKeywords;
		this.implementations = implementations;
		this.docsDir = docsDir;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	public static NassaSoftwareEntry fromYaml(Reader yamlSource, String gitHtmlUrl, String longDescription) {
		Yaml yaml = new Yaml();
		Map<String, Object> map = yaml.load(yamlSource);

		String id = (String) map.get("id");
		String nassaVersion = (String) map.get("nassaVersion");
		String moduleType = (String) map.get("moduleType");
		String title = (String) map.get("title");
		String moduleVersion = (String) map.get("moduleVersion");
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> contributorsUnparsed = (List<Map<String, Object>>) map.get("contributors");
		List<NassaContributor> contributors = new ArrayList<>(contributorsUnparsed.size());
		int position = 1;
		for (Map<String, Object> contributorMap : contributorsUnparsed) {
			contributors.add(NassaContributor.fromParsedYaml(contributorMap, position));
			position++;
		}
		String license = (String) map.get("license");
		Date lastUpdateDate = (Date) map.get("lastUpdateDate");
		String shortDescription = (String) map.get("description");
		@SuppressWarnings("unchecked")
		List<String> relatedModules = (List<String>) map.get("relatedModules");
		@SuppressWarnings("unchecked")
		Map<String, List<String>> references = (Map<String, List<String>>) map.get("references");
		@SuppressWarnings("unchecked")
		Map<String, List<String>> domainKeywords = (Map<String, List<String>>) map.get("domainKeywords");
		if (domainKeywords == null) {
			domainKeywords = Map.of();
		}
		@SuppressWarnings("unchecked")
		List<String> modellingKeywords = (List<String>) map.get("modellingKeywords");
		@SuppressWarnings("unchecked")
		List<String> programmingKeywords = (List<String>) map.get("programmingKeywords");
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> implementations = (List<Map<String, Object>>) map.get("implementations");
		String docsDir = (String) map.get("docsDir");
		@SuppressWarnings("unchecked")
		List<Map<String, String>> inputs = (List<Map<String, String>>) map.get("inputs");
		@SuppressWarnings("unchecked")
		List<Map<String, String>> outputs = (List<Map<String, String>>) map.get("outputs");

		return new NassaSoftwareEntry(
			gitHtmlUrl,
			id,
			nassaVersion,
			moduleType,
			title,
			moduleVersion,
			contributors,
			license,
			lastUpdateDate,
			shortDescription,
			longDescription,
			relatedModules,
			references,
			domainKeywords,
			modellingKeywords,
			programmingKeywords,
			implementations,
			docsDir,
			inputs,
			outputs
		);
	}

	public String toRsdJson(Map<String, ExternalMentionRecord> mentions, Map<String, SpdxLicense> licenseMap) {
		JsonObject root = new JsonObject();
		root.addProperty("slug", id.toLowerCase());
		root.addProperty("brand_name", title);
		root.addProperty("description", descriptionWithInputsAndOutputs());
		root.addProperty("short_statement", shortDescription.length() > 300 ? shortDescription.substring(0, 297) + "..." : shortDescription);
		root.addProperty("get_started_url", gitHtmlUrl + "/" + docsDir);
		root.addProperty("repository_url", gitHtmlUrl);

		if (license != null) {
			SpdxLicense spdxLicense = licenseMap.get(license);
			if (spdxLicense != null) {
				root.addProperty("license_value", spdxLicense.licenseId());
				root.addProperty("license_name", spdxLicense.name());
				root.addProperty("license_url", spdxLicense.reference());
				root.addProperty("license_open_source", true);
			} else {
				LOGGER.warn("Unexpected SPDX license: {}", license);
				// we need to add this so we can call the nassa_import RPC with all parameters
				root.add("license_value", JsonNull.INSTANCE);
				root.add("license_name", JsonNull.INSTANCE);
				root.add("license_url", JsonNull.INSTANCE);
				root.add("license_open_source", JsonNull.INSTANCE);
			}
		}

		JsonArray relatedModulesJson = new JsonArray();
		if (relatedModules != null) {
			relatedModules.forEach(id -> relatedModulesJson.add(id.toLowerCase()));
		}
		root.add("related_modules", relatedModulesJson);

		JsonArray familyNamesArray = new JsonArray(contributors.size());
		JsonArray givenNamesArray = new JsonArray(contributors.size());
		JsonArray roleArray = new JsonArray(contributors.size());
		JsonArray orcidArray = new JsonArray(contributors.size());
		JsonArray positionArray = new JsonArray(contributors.size());
		for (NassaContributor contributor : contributors) {
			familyNamesArray.add(contributor.familyName);
			givenNamesArray.add(contributor.givenName);
			roleArray.add(contributor.roles);
			orcidArray.add(contributor.orcid);
			positionArray.add(contributor.position);
		}

		root.add("family_names_array", familyNamesArray);
		root.add("given_names_array", givenNamesArray);
		root.add("role_array", roleArray);
		root.add("orcid_array", orcidArray);
		root.add("position_array", positionArray);

		JsonObject categoriesJson = new JsonObject();

		JsonArray modellingKeywordsJson = new JsonArray(modellingKeywords.size());
		modellingKeywords.forEach(modellingKeywordsJson::add);
		categoriesJson.add("Modelling", modellingKeywordsJson);

		JsonArray programmingKeywordsJson = new JsonArray(programmingKeywords.size());
		programmingKeywords.forEach(programmingKeywordsJson::add);
		categoriesJson.add("Programming", programmingKeywordsJson);

		List<String> regionsKeywords = domainKeywords.get("regions");
		if (regionsKeywords != null) {
			JsonArray regionsKeywordsJson = new JsonArray(regionsKeywords.size());
			regionsKeywords.forEach(regionsKeywordsJson::add);
			categoriesJson.add("Region", regionsKeywordsJson);
		}

		List<String> periodsKeywords = domainKeywords.getOrDefault("periods", List.of());
		if (periodsKeywords != null) {
			JsonArray periodsKeywordsJson = new JsonArray(periodsKeywords.size());
			periodsKeywords.forEach(periodsKeywordsJson::add);
			categoriesJson.add("Period", periodsKeywordsJson);
		}

		List<String> subjectsKeywords = domainKeywords.getOrDefault("subjects", List.of());
		if (subjectsKeywords != null) {
			JsonArray subjectsKeywordsJson = new JsonArray(subjectsKeywords.size());
			subjectsKeywords.forEach(subjectsKeywordsJson::add);
			categoriesJson.add("Subject", subjectsKeywordsJson);
		}

		if (implementations != null) {
			JsonArray languagesJson = new JsonArray();
			for (Map<String, Object> implementation : implementations) {
				if (implementation != null && implementation.get("language") != null && implementation.get("language") instanceof String lang) {
					languagesJson.add(lang);
				}
			}
			categoriesJson.add("Language", languagesJson);
		}

		JsonArray moduleTypeJson = new JsonArray();
		moduleTypeJson.add(moduleType);
		categoriesJson.add("Module type", moduleTypeJson);

		root.add("categories", categoriesJson);

		Collection<ExternalMentionRecord> regularMentions = new ArrayList<>();
		if (references != null && references.get("moduleReferences") != null) {
			references.get("moduleReferences").forEach(citekey -> {
				if (mentions.get(citekey) != null) {
					regularMentions.add(mentions.get(citekey));
				}
			});
		}

		if (references != null && references.get("useExampleReferences") != null) {
			references.get("useExampleReferences").forEach(citekey -> {
				if (mentions.get(citekey) != null) {
					regularMentions.add(mentions.get(citekey));
				}
			});
		}
		root.add("regular_mentions", PostgrestMentionRepository.toRsdJsonArray(regularMentions));

		return root.toString();
	}

	private String descriptionWithInputsAndOutputs() {
		StringBuilder descriptionBuilder = new StringBuilder();
		if (longDescription != null) {
			descriptionBuilder.append(longDescription);
			descriptionBuilder.append('\n');
			descriptionBuilder.append('\n');
		}

		if (inputs != null && !inputs.isEmpty()) {
			descriptionBuilder.append('\n');
			descriptionBuilder.append("## Inputs\n");
			descriptionBuilder.append('\n');
			descriptionBuilder.append("|**Name**|**Type**|**Description**|\n");
			descriptionBuilder.append("|-|-|-|\n");

			for (Map<String, String> input : inputs) {
				String name = input.getOrDefault("name", "");
				String type = input.getOrDefault("type", "");
				String description = input.getOrDefault("description", "");
				descriptionBuilder.append("|%s|%s|%s|\n".formatted(name, type, description));
			}

			descriptionBuilder.append("||||\n");
		}

		if (outputs != null && !outputs.isEmpty()) {
			descriptionBuilder.append('\n');
			descriptionBuilder.append("## Outputs\n");
			descriptionBuilder.append('\n');
			descriptionBuilder.append("|**Name**|**Type**|**Description**|\n");
			descriptionBuilder.append("|-|-|-|\n");

			for (Map<String, String> output : outputs) {
				String name = output.getOrDefault("name", "");
				String type = output.getOrDefault("type", "");
				String description = output.getOrDefault("description", "");
				descriptionBuilder.append("|%s|%s|%s|\n".formatted(name, type, description));
			}

			descriptionBuilder.append("||||\n");
		}

		return descriptionBuilder.toString();
	}
}

class NassaContributor {
	final String givenName;
	final String familyName;
	final String emailAddress;
	final String roles;
	final String orcid;
	final int position;

	private NassaContributor(
		String givenName,
		String familyName,
		String emailAddress,
		String roles,
		String orcid,
		int position
	) {
		this.givenName = givenName;
		this.familyName = familyName;
		this.emailAddress = emailAddress;
		this.roles = roles;
		this.orcid = orcid;
		this.position = position;
	}

	static NassaContributor fromParsedYaml(Map<String, Object> map, int position) {
		String name = (String) map.get("name");
		String[] nameSplit = name.split(", ");
		String givenName = nameSplit.length >= 2 ? nameSplit[1] : "";
		String familyName = nameSplit[0];
		@SuppressWarnings("unchecked")
		List<String> roleList = (List<String>) map.get("roles");
		String roles = String.join(", ", roleList);
		String emailAddress = (String) map.get("email");
		String orcid = (String) map.get("orcid");

		return new NassaContributor(
			givenName,
			familyName,
			emailAddress,
			roles,
			orcid,
			position
		);
	}
}
