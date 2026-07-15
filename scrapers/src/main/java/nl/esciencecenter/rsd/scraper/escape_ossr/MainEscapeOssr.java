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
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import nl.esciencecenter.rsd.scraper.license.GitHubSpdxLicenseRepository;
import nl.esciencecenter.rsd.scraper.license.SpdxLicense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MainEscapeOssr {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainEscapeOssr.class);

	public static void main(String[] args)
		throws IOException, RsdParsingException, InterruptedException, RsdResponseException {
		Map<String, SpdxLicense> licenseMap = GitHubSpdxLicenseRepository.getLicensesByIdMap();

		try (ExecutorService threadpool = Executors.newCachedThreadPool()) {
			Collection<ZenodoEntry> escapeOssrRecords = ZenodoConnector.getEscapeOssrRecords();
			System.out.println(escapeOssrRecords.size());
			for (ZenodoEntry escapeOssrRecord : escapeOssrRecords) {
				System.out.println(escapeOssrRecord);

				threadpool.submit(() -> {
					try {
						Optional<URI> codemetaUrl = ZenodoConnector.getCodemetaUrl(escapeOssrRecord);
						System.out.println(codemetaUrl);

						if (codemetaUrl.isEmpty()) {
							LOGGER.warn(
								"No CodeMeta file found for \"{}\" with ID {}",
								escapeOssrRecord.filesLink(),
								escapeOssrRecord.id()
							);
							return null;
						}
						String codemetaContent = ZenodoConnector.downloadCodemeta(codemetaUrl.get());
						// System.out.println(codemetaContent);

						EscapeOssrSoftwareEntry softwareEntry = EscapeOssrSoftwareEntry.fromCodemeta(
							codemetaContent,
							escapeOssrRecord.conceptDoi()
						);
						Utils.postAsAdmin(
							Config.backendBaseUrl() + "/rpc/software_import",
							softwareEntry.toRsdJson(licenseMap)
						);
					} catch (Exception e) {
						System.err.println(escapeOssrRecord.id());
						System.err.println(escapeOssrRecord.filesLink());
						e.printStackTrace();
					}
					return null;
				});
			}
		}
	}
}
