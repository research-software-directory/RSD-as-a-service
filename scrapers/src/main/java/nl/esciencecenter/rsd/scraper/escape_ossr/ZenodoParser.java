// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.escape_ossr;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import nl.esciencecenter.rsd.scraper.doi.Doi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ZenodoParser {

	private static final Logger LOGGER = LoggerFactory.getLogger(ZenodoParser.class);

	static Collection<ZenodoEntry> parseZenodoRecords(String json, AtomicBoolean isLastPage, int pageSize)
		throws RsdParsingException {
		try {
			JsonObject responseObject = JsonParser.parseString(json).getAsJsonObject();
			JsonObject hitsObject = responseObject.getAsJsonObject("hits");
			JsonArray hitsArray = hitsObject.getAsJsonArray("hits");
			Collection<ZenodoEntry> result = new ArrayList<>(hitsArray.size());

			if (hitsArray.size() < pageSize) {
				isLastPage.setPlain(true);
			}

			for (JsonElement jsonElement : hitsArray) {
				try {
					ZenodoEntry parsedRecord = parseZenodoRecord(jsonElement);
					result.add(parsedRecord);
				} catch (RsdParsingException e) {
					LOGGER.warn("Skipping Zenodo entry with parsing errors", e);
				}
			}

			return result;
		} catch (RuntimeException e) {
			throw new RsdParsingException("Could not parse Zenodo records", e);
		}
	}

	static ZenodoEntry parseZenodoRecord(JsonElement zenodoElement) throws RsdParsingException {
		try {
			JsonObject zenodoObject = zenodoElement.getAsJsonObject();

			String id = zenodoObject.getAsJsonPrimitive("id").getAsString();
			String rawConceptDoi = zenodoObject.getAsJsonPrimitive("conceptdoi").getAsString();
			Doi conceptDoi = Doi.fromString(rawConceptDoi);

			JsonObject linksArray = zenodoObject.getAsJsonObject("links");
			String filesLink = linksArray.getAsJsonPrimitive("files").getAsString();
			URI filesUrl = URI.create(filesLink);

			return new ZenodoEntry(id, conceptDoi, filesUrl);
		} catch (RuntimeException e) {
			throw new RsdParsingException("Error parsing Zenodo entry", e);
		}
	}

	static Collection<ZenodoFileMetadata> parseZenodoFileMetadataEntries(String json) throws RsdParsingException {
		try {
			JsonObject responseObject = JsonParser.parseString(json).getAsJsonObject();
			JsonArray entriesArray = responseObject.getAsJsonArray("entries");
			Collection<ZenodoFileMetadata> result = new ArrayList<>(entriesArray.size());

			for (JsonElement jsonElement : entriesArray) {
				try {
					result.add(parseZenodoFileMetadataEntry(jsonElement));
				} catch (RsdParsingException e) {
					LOGGER.warn("Skipping Zenodo file entry with parsing errors", e);
				}
			}

			return result;
		} catch (RuntimeException e) {
			throw new RsdParsingException("Could not parse Zenodo files", e);
		}
	}

	static ZenodoFileMetadata parseZenodoFileMetadataEntry(JsonElement fileElement) throws RsdParsingException {
		try {
			JsonObject fileObject = fileElement.getAsJsonObject();
			String key = fileObject.getAsJsonPrimitive("key").getAsString();
			String mimeType = fileObject.getAsJsonPrimitive("mimetype").getAsString();
			URI contentUrl = URI.create(
				fileObject.getAsJsonObject("links").getAsJsonPrimitive("content").getAsString()
			);

			JsonElement containerElement = fileObject.getAsJsonObject("links").getAsJsonPrimitive("container");
			Optional<URI> containerUrl =
				containerElement != null && containerElement.isJsonPrimitive()
					? Optional.of(URI.create(containerElement.getAsString()))
					: Optional.empty();

			return new ZenodoFileMetadata(key, mimeType, contentUrl, containerUrl);
		} catch (RuntimeException e) {
			throw new RsdParsingException("Error parsing Zenodo file entry", e);
		}
	}

	static Collection<ZenodoZipEntryMetadata> parseZenodoZipFileMetadataEntries(String json)
		throws RsdParsingException {
		try {
			JsonObject responseObject = JsonParser.parseString(json).getAsJsonObject();
			JsonArray entriesArray = responseObject.getAsJsonArray("entries");
			Collection<ZenodoZipEntryMetadata> result = new ArrayList<>(entriesArray.size());

			for (JsonElement jsonElement : entriesArray) {
				try {
					result.add(parseZenodoZipFileMetadataEntry(jsonElement));
				} catch (RsdParsingException e) {
					LOGGER.warn("Skipping Zenodo zip file entry with parsing errors", e);
				}
			}

			return result;
		} catch (RuntimeException e) {
			throw new RsdParsingException("Could not parse Zenodo zip file entries", e);
		}
	}

	static ZenodoZipEntryMetadata parseZenodoZipFileMetadataEntry(JsonElement fileElement) throws RsdParsingException {
		try {
			JsonObject fileObject = fileElement.getAsJsonObject();
			String key = fileObject.getAsJsonPrimitive("key").getAsString();
			String mimeType = fileObject.getAsJsonPrimitive("mimetype").getAsString();
			URI contentUrl = URI.create(
				fileObject.getAsJsonObject("links").getAsJsonPrimitive("content").getAsString()
			);

			return new ZenodoZipEntryMetadata(key, mimeType, contentUrl);
		} catch (RuntimeException e) {
			throw new RsdParsingException("Error parsing Zenodo zip file entry", e);
		}
	}
}
