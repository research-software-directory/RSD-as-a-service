// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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

public class MainCommits {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainCommits.class);

	public static void main(String[] args) {

		LOGGER.info("Start scraping commits");

		long t1 = System.currentTimeMillis();

		scrapeGitHub();
		scrapeGitLab();
		scrape4tu();

		long time = System.currentTimeMillis() - t1;

		LOGGER.info("Done scraping commits ({} ms.)", time);
	}

	private static void scrapeGitLab() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
		Collection<BasicRepositoryDataWithHistory> dataToScrape = softwareInfoRepository.commitDataWithHistory(Config.maxRequestsGitLab());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryDataWithHistory repositoryDataToScrape : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = repositoryDataToScrape.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					CommitsPerWeek existingCommitsPerWeek = repositoryDataToScrape.commitsPerWeek();
					ZonedDateTime lastCommitHistoryTimestamp = existingCommitsPerWeek.popLatestTimestamp();
					CommitsPerWeek scrapedCommits = new GitlabScraper(apiUrl, projectPath, lastCommitHistoryTimestamp, existingCommitsPerWeek).contributions();

					BasicRepositoryData basicData = new BasicRepositoryData(repositoryDataToScrape.software(), repositoryDataToScrape.url());
					CommitData updatedData = new CommitData(basicData, scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", repositoryDataToScrape.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", repositoryDataToScrape.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", repositoryDataToScrape.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", repositoryDataToScrape.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", repositoryDataToScrape.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "commit_history_last_error", repositoryDataToScrape.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGitHub() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.commitData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData commitData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = commitData.url();

					Optional<GithubScraper> githubScraperOptional = GithubScraper.create(repoUrl);
					if (githubScraperOptional.isEmpty()) {
						Utils.saveErrorMessageInDatabase("Not a valid GitHub URL: " + repoUrl, "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
						return;
					}

					GithubScraper githubScraper = githubScraperOptional.get();
					CommitsPerWeek scrapedCommits = githubScraper.contributions();
					CommitData updatedData = new CommitData(commitData, scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					Utils.saveExceptionInDatabase("GitHub commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitHub commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitHub commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrape4tu() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.FOURTU);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.commitData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData commitData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = commitData.url();

					FourTuGitScraper fourTuGitScraper = new FourTuGitScraper(repoUrl);
					CommitsPerWeek scrapedCommits = fourTuGitScraper.contributions();
					CommitData updatedData = new CommitData(commitData, scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					Utils.saveExceptionInDatabase("4TU commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("4TU commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("4TU commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
