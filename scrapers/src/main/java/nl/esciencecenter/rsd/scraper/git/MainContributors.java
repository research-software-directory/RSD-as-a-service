// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class MainContributors {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainContributors.class);

	public static void main(String[] args) {
		LOGGER.info("Start scraping contributors");

		long t1 = System.currentTimeMillis();

		scrapeGitHub();
		scrapeGitLab();
		scrape4tu();

		long time = System.currentTimeMillis() - t1;

		LOGGER.info("Done scraping contributors ({} ms.)", time);
	}

	private static void scrapeGitHub() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.contributorData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData contributorData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = contributorData.url();

					Optional<GithubScraper> githubScraperOptional = GithubScraper.create(repoUrl);
					if (githubScraperOptional.isEmpty()) {
						Utils.saveErrorMessageInDatabase("Not a valid GitHub URL: " + repoUrl, "repository_url", "contributor_count_last_error", contributorData.software()
							.toString(), "software", scrapedAt, "contributor_count_scraped_at");
						return;
					}

					GithubScraper githubScraper = githubScraperOptional.get();
					Integer scrapedContributorData = githubScraper.contributorCount();
					ContributorDatabaseData updatedData = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), scrapedContributorData, scrapedAt);
					softwareInfoRepository.saveContributorCount(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					Utils.saveExceptionInDatabase("GitHub contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitHub contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitHub contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGitLab() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.contributorData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData contributorData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = contributorData.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					Integer scrapedContributorData = new GitlabScraper(apiUrl, projectPath).contributorCount();
					ContributorDatabaseData updatedData = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), scrapedContributorData, scrapedAt);
					softwareInfoRepository.saveContributorCount(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					Utils.saveExceptionInDatabase("GitLab contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitLab contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitLab contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrape4tu() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.FOURTU);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.contributorData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData contributorData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = contributorData.url();

					FourTuGitScraper fourTuGitScraper = new FourTuGitScraper(repoUrl);

					Integer scrapedContributorData = fourTuGitScraper.contributorCount();
					ContributorDatabaseData updatedData = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), scrapedContributorData, scrapedAt);
					softwareInfoRepository.saveContributorCount(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					Utils.saveExceptionInDatabase("4TU contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("4TU contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("4TU contributor scraper", "repository_url", contributorData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "contributor_count_last_error", contributorData.software()
						.toString(), "software", scrapedAt, "contributor_count_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
