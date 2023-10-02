// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class MainBasicData {

	public static void main(String[] args) {
		System.out.println("Start scraping basic Git data");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping basic Git data");
	}

	private static void scrapeGitHub() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.statsData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData basicData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = basicData.url();

					Optional<GithubScraper> githubScraperOptional = GithubScraper.create(repoUrl);
					if (githubScraperOptional.isEmpty()) {
						Utils.saveErrorMessageInDatabase("Not a valid GitHub URL: " + repoUrl, "repository_url", "basic_data_last_error", basicData.software().toString(), "software", scrapedAt, "basic_data_scraped_at");
						return;
					}

					GithubScraper githubScraper = githubScraperOptional.get();
					BasicGitData scrapedBasicData = githubScraper.basicData();
					BasicGitDatabaseData updatedData = new BasicGitDatabaseData(basicData, scrapedBasicData, scrapedAt);
					softwareInfoRepository.saveBasicData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitHub basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "basic_data_last_error", basicData.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitHub basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "basic_data_last_error", basicData.software().toString(), "software", scrapedAt, "basic_data_scraped_at");
				} catch (RuntimeException e) {
					Utils.saveExceptionInDatabase("GitHub basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "basic_data_last_error", basicData.software().toString(), "software", scrapedAt, "basic_data_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGitLab() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.statsData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData basicData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = basicData.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					BasicGitData scrapedBasicData = new GitlabScraper(apiUrl, projectPath).basicData();
					BasicGitDatabaseData updatedData = new BasicGitDatabaseData(basicData, scrapedBasicData, scrapedAt);
					softwareInfoRepository.saveBasicData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitLab basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "basic_data_last_error", basicData.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitLab basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "basic_data_last_error", basicData.software().toString(), "software", scrapedAt, "basic_data_scraped_at");
				} catch (RuntimeException e) {
					Utils.saveExceptionInDatabase("GitLab basic data scraper", "repository_url", basicData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "basic_data_last_error", basicData.software().toString(), "software", scrapedAt, "basic_data_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
