// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.nassa;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.BibtexParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import nl.esciencecenter.rsd.scraper.doi.ExternalMentionRecord;
import nl.esciencecenter.rsd.scraper.license.GitHubSpdxLicenseRepository;
import nl.esciencecenter.rsd.scraper.license.SpdxLicense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class MainNassa {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainNassa.class);
	static HttpClient httpClient = HttpClient.newHttpClient();
	static Pattern nassaModulePattern = Pattern.compile("^\\d\\d\\d\\d-\\w+-\\d\\d\\d$");

	// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28
	public static void main(String[] args) throws IOException, InterruptedException, RsdResponseException {
		if (!Config.isNassaScraperEnabled()) {
			return;
		}

		URI rootContentUri = URI.create("https://api.github.com/repos/Archaeology-ABM/NASSA-modules/contents/");
		HttpRequest httpRequest = HttpRequest
				.newBuilder(rootContentUri)
				.GET()
				.build();

		HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
		if (httpResponse.statusCode() != 200) {
			String message = "Got a non-200 response from the GitHub API quering then contents of the NASSA repository";
			LOGGER.error(message);
			RsdResponseException exceptionToSave = new RsdResponseException(httpResponse.statusCode(), rootContentUri, httpResponse.body(), message);
			Utils.saveExceptionInDatabase("NASSA scraper", null, null, exceptionToSave);
			System.exit(1);
		}

		JsonArray jsonArray = JsonParser.parseString(httpResponse.body()).getAsJsonArray();
		Collection<String[]> modules = new ArrayList<>();
		for (JsonElement jsonElement : jsonArray) {
			String fileOrDirName = jsonElement.getAsJsonObject().getAsJsonPrimitive("name").getAsString();
			String htmlUrl = jsonElement.getAsJsonObject().getAsJsonPrimitive("html_url").getAsString();
			if (nassaModulePattern.asPredicate().test(fileOrDirName)) {
				modules.add(new String[]{fileOrDirName, htmlUrl});
			}
		}

		List<NassaSoftwareEntry> modulesToSave = new ArrayList<>(modules.size());
		List<Map<String, ExternalMentionRecord>> mentionsOfModules = new ArrayList<>(modules.size());
		for (String[] moduleInfo : modules) {
			try {
				// e.g. https://raw.githubusercontent.com/Archaeology-ABM/NASSA-modules/main/1870-Schliemann-001/NASSA.yml
				URI ymlUri = URI.create("https://raw.githubusercontent.com/Archaeology-ABM/NASSA-modules/main/%s/NASSA.yml".formatted(moduleInfo[0]));
				httpRequest = HttpRequest
						.newBuilder(ymlUri)
						.GET()
						.build();

				httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
				StringReader ymlStringReader = new StringReader(httpResponse.body());

				// e.g. https://raw.githubusercontent.com/Archaeology-ABM/NASSA-modules/main/1870-Schliemann-001/references.bib
				URI bibUri = URI.create("https://raw.githubusercontent.com/Archaeology-ABM/NASSA-modules/main/%s/references.bib".formatted(moduleInfo[0]));
				httpRequest = HttpRequest
						.newBuilder(bibUri)
						.GET()
						.build();
				httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
				StringReader bibStringReader = new StringReader(httpResponse.body());
				Map<String, ExternalMentionRecord> mentions;
				try {
					mentions = BibtexParser.parse(bibStringReader);
				} catch (Exception e) {
					String message = "Exception parsing the Bibtex file of the following module: " + Arrays.toString(moduleInfo);
					Exception exceptionToSave = new Exception(message, e);
					Utils.saveExceptionInDatabase("NASSA scraper", null, null, exceptionToSave);
					mentions = Map.of();
				}
				mentionsOfModules.add(mentions);

				LOGGER.info("parsing module: {} at URL {}", moduleInfo[0], ymlUri);
				NassaSoftwareEntry softwareEntry = NassaSoftwareEntry.fromYaml(ymlStringReader, moduleInfo[1]);
				modulesToSave.add(softwareEntry);
				LOGGER.info("done parsing module: {}", moduleInfo[0]);
			} catch (InterruptedException e) {
				String message = "InterruptedException handling the following module: " + Arrays.toString(moduleInfo);
				Exception exceptionToSave = new Exception(message, e);
				Utils.saveExceptionInDatabase("NASSA scraper", null, null, exceptionToSave);
				throw e;
			} catch (Exception e) {
				String message = "Exception handling the following module: " + Arrays.toString(moduleInfo);
				Exception exceptionToSave = new Exception(message, e);
				Utils.saveExceptionInDatabase("NASSA scraper", null, null, exceptionToSave);
			}
		}

		Map<String, SpdxLicense> licenseMap = Collections.emptyMap();
		try {
			licenseMap = GitHubSpdxLicenseRepository.getLicensesByIdMap();
		} catch (Exception e) {
			LOGGER.error("Error when getting SPDX licence map from GitHub: {}", e.getMessage());
			Utils.saveExceptionInDatabase("NASSA scraper", null, null, e);
			if (e instanceof InterruptedException) {
				throw e;
			}
		}

		for (int i = 0; i < modulesToSave.size(); i++) {
			NassaSoftwareEntry nassaSoftwareEntry = modulesToSave.get(i);
			Map<String, ExternalMentionRecord> mentions = mentionsOfModules.get(i);
			LOGGER.info("saving module to database: {}", nassaSoftwareEntry.id);
			try {
				Utils.postAsAdmin(Config.backendBaseUrl() + "/rpc/nassa_import", nassaSoftwareEntry.toRsdJson(mentions, licenseMap));
			} catch (Exception e) {
				String message = "Exception handling the following module: " + nassaSoftwareEntry.id;
				Exception exceptionToSave = new Exception(message, e);
				Utils.saveExceptionInDatabase("NASSA scraper", null, null, exceptionToSave);
			}
			LOGGER.info("done saving module to database: {}", nassaSoftwareEntry.id);
		}
	}
}
