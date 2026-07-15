// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.escape_ossr;

import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import nl.esciencecenter.rsd.scraper.license.GitHubSpdxLicenseRepository;
import nl.esciencecenter.rsd.scraper.license.SpdxLicense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MainEscapeOssr {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainEscapeOssr.class);
	private static final String SERVICE_NAME = "ESCAPE_OSSR harvester";

	public static void main() {
		if (!Config.isEscapeOssrScraperEnabled()) {
			LOGGER.info("The ESCAPE OSSR harvester is disabled");
			return;
		}

		LOGGER.info("Start harvesting ESCAPE OSSR software");

		final Map<String, SpdxLicense> licenseMap;
		final Collection<ZenodoEntry> escapeOssrRecords;
		try {
			LOGGER.info("Downloading SPDX licenses...");
			licenseMap = GitHubSpdxLicenseRepository.getLicensesByIdMap();
			LOGGER.info("Downloaded SPDX licenses successfully");

			LOGGER.info("Downloading metadata of ESCAPE OSSR records...");
			escapeOssrRecords = ZenodoConnector.getEscapeOssrRecords();
			LOGGER.info("Found {} ESCAPE OSSR records", escapeOssrRecords.size());
		} catch (RsdResponseException e) {
			LOGGER.error("Error when making request to {}, got status {} and body {}", e.uri, e.statusCode, e.body, e);
			Utils.saveExceptionInDatabase(SERVICE_NAME, null, null, e);
			return;
		} catch (Exception e) {
			LOGGER.error("Error", e);
			Utils.saveExceptionInDatabase(SERVICE_NAME, null, null, e);

			if (e instanceof InterruptedException) {
				Thread.currentThread().interrupt();
			}

			return;
		}

		try (ExecutorService threadpool = Executors.newCachedThreadPool()) {
			for (ZenodoEntry escapeOssrRecord : escapeOssrRecords) {
				Runnable task = () -> {
					try {
						LOGGER.info("Trying to find CodeMeta file URL for entry {}", escapeOssrRecord.id());
						Optional<URI> codemetaUrl = ZenodoConnector.getCodemetaUrl(escapeOssrRecord);
						if (codemetaUrl.isEmpty()) {
							LOGGER.warn(
								"No CodeMeta file found for entry {}, the files link was {}",
								escapeOssrRecord.id(),
								escapeOssrRecord.filesLink()
							);
							return;
						}

						LOGGER.info(
							"Found CodeMeta file URL for entry {}, starting download...",
							escapeOssrRecord.id()
						);

						String codemetaContent = ZenodoConnector.downloadCodemeta(codemetaUrl.get());
						LOGGER.info(
							"Successfully downloaded CodeMeta file for {}, converting to RSD entry",
							escapeOssrRecord.id()
						);

						EscapeOssrSoftwareEntry softwareEntry = EscapeOssrSoftwareEntry.fromCodemeta(
							codemetaContent,
							escapeOssrRecord.conceptDoi()
						);
						try {
							softwareEntry.harvestReadmeUrl();
						} catch (RsdResponseException e) {
							LOGGER.warn(
								"Exception when getting README URL of {}, using description from CodeMeta instead, made request to {}, got status {} and body {}",
								softwareEntry.repoUrl,
								e.uri,
								e.statusCode,
								e.body,
								e
							);
						} catch (IOException e) {
							LOGGER.warn(
								"Exception when getting README URL of {}, using description from CodeMeta instead",
								softwareEntry.repoUrl,
								e
							);
						}

						LOGGER.info("Saving RSD entry for {} in the database", escapeOssrRecord.id());
						Utils.postAsAdmin(
							Config.backendBaseUrl() + "/rpc/software_import",
							softwareEntry.toRsdJson(licenseMap)
						);
						LOGGER.info("Saved {} as entry in the database", escapeOssrRecord.id());
					} catch (RsdResponseException e) {
						LOGGER.error(
							"Error for entry {}, files URL {}, when making request to {}, got status {} and body {}",
							escapeOssrRecord.id(),
							escapeOssrRecord.filesLink(),
							e.uri,
							e.statusCode,
							e.body,
							e
						);
						Utils.saveExceptionInDatabase(SERVICE_NAME, null, null, e);
					} catch (Exception e) {
						LOGGER.error(
							"Error for entry {}, files URL {}",
							escapeOssrRecord.id(),
							escapeOssrRecord.filesLink(),
							e
						);
						Utils.saveExceptionInDatabase(SERVICE_NAME, null, null, e);

						if (e instanceof InterruptedException) {
							Thread.currentThread().interrupt();
						}
					}
				};

				threadpool.submit(task);
			}
		}

		LOGGER.info("Done harvesting ESCAPE OSSR software");
	}
}
