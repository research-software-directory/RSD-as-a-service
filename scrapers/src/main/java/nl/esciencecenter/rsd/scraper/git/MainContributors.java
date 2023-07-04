// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;

public class MainContributors {

	public static void main(String[] args) {
		System.out.println("Start scraping contributors");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping contributors");
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
					String repo = repoUrl.replace("https://github.com/", "");
					if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

					Integer scrapedContributorData = new GithubScraper("https://api.github.com", repo).contributorCount();
					ContributorDatabaseData updatedData = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), scrapedContributorData, scrapedAt);
					softwareInfoRepository.saveContributorCount(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					System.out.println("Exception when handling data from url " + contributorData.url() + ":");
					e.printStackTrace();
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + contributorData.url() + ":");
					e.printStackTrace();
					ContributorDatabaseData onlyUpdatedAt = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveContributorCount(onlyUpdatedAt);
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
					System.out.println("Exception when handling data from url " + contributorData.url() + ":");
					e.printStackTrace();
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + contributorData.url() + ":");
					e.printStackTrace();
					ContributorDatabaseData onlyUpdatedAt = new ContributorDatabaseData(new BasicRepositoryData(contributorData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveContributorCount(onlyUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
