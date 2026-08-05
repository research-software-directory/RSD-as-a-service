// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.escape_ossr;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

public class ZenodoConnector {

	private static final String ESCAPE_OSSR_RECORDS_URL =
		"https://zenodo.org/api/records?communities=escape2020&type=software";

	private ZenodoConnector() {}

	public static Collection<ZenodoEntry> getEscapeOssrRecords()
		throws IOException, InterruptedException, RsdParsingException, RsdResponseException {
		int page = 1;
		int pageSize = 25;
		AtomicBoolean isLastPage = new AtomicBoolean(false);
		Collection<ZenodoEntry> result = new ArrayList<>();

		while (!isLastPage.getPlain()) {
			HttpResponse<String> response = Utils.getAsHttpResponse(
				ESCAPE_OSSR_RECORDS_URL + "&page=%d&size=%d".formatted(page, pageSize)
			);

			if (response.statusCode() != 200) {
				throw new RsdResponseException(
					response.statusCode(),
					response.uri(),
					response.body(),
					"Could not query Escape-OSSR records"
				);
			}

			result.addAll(ZenodoParser.parseZenodoRecords(response.body(), isLastPage, pageSize));
			++page;
		}

		// this is a wrong, duplicate entry of "Gammapy: Python toolbox for gamma-ray astronomy",
		// the correct entry has ID 20432079
		result.removeIf(entry -> entry.id().equals("14867036"));

		return result;
	}

	public static Optional<URI> getCodemetaUrl(ZenodoEntry zenodoEntry)
		throws IOException, InterruptedException, RsdParsingException, RsdResponseException {
		HttpResponse<String> filesResponse = Utils.getAsHttpResponse(zenodoEntry.filesLink());

		if (filesResponse.statusCode() != 200) {
			throw new RsdResponseException(
				filesResponse.statusCode(),
				filesResponse.uri(),
				filesResponse.body(),
				"Could not query Zenodo files"
			);
		}

		Collection<ZenodoFileMetadata> files = ZenodoParser.parseZenodoFileMetadataEntries(filesResponse.body());

		Optional<URI> directCodemetaUrl = files
			.stream()
			.filter(entry -> "application/json".equals(entry.mimetype()))
			.filter(entry -> "codemeta.json".equals(entry.key()))
			.findAny()
			.map(ZenodoFileMetadata::contentUrl);
		if (directCodemetaUrl.isPresent()) {
			return directCodemetaUrl;
		}

		Collection<ZenodoFileMetadata> zipFiles = files
			.stream()
			.filter(entry -> "application/zip".equals(entry.mimetype()))
			.filter(entry -> entry.containerUrl().isPresent())
			.toList();

		for (ZenodoFileMetadata zipFileMetadata : zipFiles) {
			HttpResponse<String> zipContainerResponse = Utils.getAsHttpResponse(
				zipFileMetadata.containerUrl().orElseThrow()
			);

			if (zipContainerResponse.statusCode() != 200) {
				throw new RsdResponseException(
					zipContainerResponse.statusCode(),
					zipContainerResponse.uri(),
					zipContainerResponse.body(),
					"Could not query Zenodo container link"
				);
			}

			Collection<ZenodoZipEntryMetadata> zipEntries = ZenodoParser.parseZenodoZipFileMetadataEntries(
				zipContainerResponse.body()
			);

			Optional<URI> zippedCodemetaUrl = zipEntries
				.stream()
				.filter(entry -> "application/json".equals(entry.mimetype()))
				.filter(entry -> entry.key() != null && entry.key().endsWith("codemeta.json"))
				.findAny()
				.map(ZenodoZipEntryMetadata::contentUrl);
			if (zippedCodemetaUrl.isPresent()) {
				return zippedCodemetaUrl;
			}
		}

		return Optional.empty();
	}

	public static String downloadCodemeta(URI codemetaUrl)
		throws IOException, InterruptedException, RsdResponseException {
		HttpResponse<String> filesResponse = Utils.getAsHttpResponse(codemetaUrl);

		if (filesResponse.statusCode() != 200) {
			throw new RsdResponseException(
				filesResponse.statusCode(),
				filesResponse.uri(),
				filesResponse.body(),
				"Could not download CodeMeta"
			);
		}

		return filesResponse.body();
	}
}
