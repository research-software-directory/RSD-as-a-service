// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.aggregator;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

public class PostgrestConnector {

	private static final Logger LOGGER = LoggerFactory.getLogger(PostgrestConnector.class);

	private PostgrestConnector() {
	}

	public static Collection<RemoteRsdData> allActiveDomains(URI baseUrl) {
		String filter = "select=id,domain,scrape_interval_minutes,scraped_at,remote_software(remote_software_id)&active=is.true";
		String url = baseUrl.toString() + "/remote_rsd?" + filter;

		String response = Utils.getAsAdmin(url);

		return parseDomainsToScrapeResponse(response);
	}

	static List<RemoteRsdData> parseDomainsToScrapeResponse(String response) {
		JsonArray jsonTree = JsonParser.parseString(response).getAsJsonArray();
		List<RemoteRsdData> result = new ArrayList<>(jsonTree.size());

		for (JsonElement element : jsonTree) {
			try {
				JsonObject jsonObject = element.getAsJsonObject();
				UUID id = UUID.fromString(jsonObject.getAsJsonPrimitive("id").getAsString());
				URI domain = URI.create(jsonObject.getAsJsonPrimitive("domain").getAsString());
				Duration refreshInterval = Duration.ofMinutes(jsonObject.getAsJsonPrimitive("scrape_interval_minutes")
					.getAsLong());
				JsonElement refreshedAtElement = jsonObject.get("scraped_at");
				ZonedDateTime refreshedAt = refreshedAtElement.isJsonNull() ? null : ZonedDateTime.parse(refreshedAtElement.getAsString());

				Collection<UUID> softwareIds = new HashSet<>();
				JsonArray idsArray = jsonObject.getAsJsonArray("remote_software");
				for (JsonElement jsonElement : idsArray) {
					UUID softwareId = UUID.fromString(jsonElement.getAsJsonObject()
						.getAsJsonPrimitive("remote_software_id")
						.getAsString());
					softwareIds.add(softwareId);
				}

				result.add(new RemoteRsdData(
					id,
					domain,
					refreshInterval,
					refreshedAt,
					softwareIds
				));
			} catch (RuntimeException e) {
				LOGGER.error("Exception when parsing item", e);
				Utils.saveExceptionInDatabase(MainAggregator.AGGREGATOR_SERVICE_NAME, MainAggregator.REMOTE_SOFTWARE_TABLE_NAME, null, e);
			}
		}

		return result;
	}

	public static void deleteSoftware(URI baseUrl, UUID remoteRsdId, UUID remoteSoftwareId) throws RsdResponseException, IOException, InterruptedException {
		String filter = "remote_rsd_id=eq." + remoteRsdId + "&remote_software_id=eq." + remoteSoftwareId;
		String url = baseUrl.toString() + "/remote_software?" + filter;

		Utils.deleteAsAdmin(url);
	}

	public static void saveRemoteSoftware(URI baseUrl, JsonArray softwareArray) {
		String url = baseUrl + "/remote_software?on_conflict=remote_rsd_id,remote_software_id";

		Utils.postAsAdmin(url, softwareArray.toString(), "Prefer", "resolution=merge-duplicates");
	}

	public static void updateRefreshedTimeAndErrorMessage(URI baseUrl, UUID id, ZonedDateTime refreshedAt, String errorMessage) {
		String filter = "id=eq." + id;
		String url = baseUrl.toString() + "/remote_rsd?" + filter;

		JsonObject body = new JsonObject();
		body.addProperty("scraped_at", refreshedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		body.addProperty("last_err_msg", errorMessage);

		Utils.patchAsAdmin(url, body.toString());
	}
}
