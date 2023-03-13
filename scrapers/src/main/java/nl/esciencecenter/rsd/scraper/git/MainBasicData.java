// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
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
					String repo = repoUrl.replace("https://github.com/", "");
					if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

					BasicGitData scrapedBasicData = new GithubScraper("https://api.github.com", repo).basicData();
					BasicGitDatabaseData updatedData = new BasicGitDatabaseData(new BasicRepositoryData(basicData.software(), null), scrapedBasicData, scrapedAt);
					softwareInfoRepository.saveBasicData(updatedData);
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + basicData.url() + ":");
					e.printStackTrace();
					BasicGitDatabaseData onlyUpdatedAt = new BasicGitDatabaseData(new BasicRepositoryData(basicData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveBasicData(onlyUpdatedAt);
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
					BasicGitDatabaseData updatedData = new BasicGitDatabaseData(new BasicRepositoryData(basicData.software(), null), scrapedBasicData, scrapedAt);
					softwareInfoRepository.saveBasicData(updatedData);
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + basicData.url() + ":");
					e.printStackTrace();
					BasicGitDatabaseData onlyUpdatedAt = new BasicGitDatabaseData(new BasicRepositoryData(basicData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveBasicData(onlyUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
