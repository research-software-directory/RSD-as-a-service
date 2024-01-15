// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping commits");
	}

	private static void scrapeGitLab() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.commitData(Config.maxRequestsGitLab());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData commitData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = commitData.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					CommitsPerWeek scrapedCommits = new GitlabScraper(apiUrl, projectPath).contributions();
					CommitData updatedData = new CommitData(commitData, scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitLab commit scraper", "repository_url", commitData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "commit_history_last_error", commitData.software().toString(), "software", scrapedAt, "commit_history_scraped_at");
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
}
