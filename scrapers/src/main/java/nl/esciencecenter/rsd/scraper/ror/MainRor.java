// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;

public class MainRor {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainRor.class);
	private static final int SCRAPING_LIMIT = Config.maxRequestsRor();

	public static void main(String[] args) {
		LOGGER.info("Start scraping ROR data.");
		long t1 = System.currentTimeMillis();
		scrapeLocationData();
		long time = System.currentTimeMillis() - t1;
		LOGGER.info("Done scraping ROR data ({} ms).", time);
	}

	private static void scrapeLocationData() {
		RorPostgrestConnector organisationsInRSD = new RorPostgrestConnector();
		Collection<OrganisationDatabaseData> organisationsToScrape = organisationsInRSD.organisationsWithoutLocation(SCRAPING_LIMIT);
		CompletableFuture<?>[] futures = new CompletableFuture[organisationsToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		String tableName = "organisation";
		String columnName = "ror_last_error";
		String primaryKeyName = "id";
		String scrapedAtName = "ror_scraped_at";
		for (OrganisationDatabaseData organisation : organisationsToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					RorScraper rorScraper = new RorScraper(organisation.rorId());
					RorData data = rorScraper.scrapeData();
					OrganisationDatabaseData updatedOrganisationDatabaseData = new OrganisationDatabaseData(organisation.id(), organisation.rorId(), scrapedAt, data);
					organisationsInRSD.saveLocationData(updatedOrganisationDatabaseData);
				} catch (RsdResponseException | IOException | InterruptedException e) {
					Utils.saveExceptionInDatabase("ROR location scraper", tableName, organisation.id(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), tableName, columnName, organisation.id().toString(), primaryKeyName, scrapedAt, scrapedAtName);
					if (e instanceof InterruptedException) {
						Thread.currentThread().interrupt();
					}
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("ROR location scraper", tableName, organisation.id(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", tableName, columnName, organisation.id().toString(), primaryKeyName, scrapedAt, scrapedAtName);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

}
