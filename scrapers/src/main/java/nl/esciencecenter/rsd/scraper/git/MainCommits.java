// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping commits");
	}

	private static void scrapeGitLab() {
		SoftwareInfoRepository softwareInfoRepository = new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
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

					CommitsPerWeek scrapedCommits = new GitLabSI(apiUrl, projectPath).contributions();
					CommitData updatedData = new CommitData(new BasicRepositoryData(commitData.software(), null), scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					System.out.println("Exception when handling data from url " + commitData.url() + ":");
					e.printStackTrace();
				} catch (RuntimeException  e) {
					System.out.println("Exception when handling data from url " + commitData.url() + ":");
					e.printStackTrace();
					CommitData oldDataWithUpdatedAt = new CommitData(new BasicRepositoryData(commitData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveCommitData(oldDataWithUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGitHub() {
		SoftwareInfoRepository softwareInfoRepository = new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.commitData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData commitData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = commitData.url();
					String repo = repoUrl.replace("https://github.com/", "");
					if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

					CommitsPerWeek scrapedCommits = new GithubSI("https://api.github.com", repo).contributions();
					CommitData updatedData = new CommitData(new BasicRepositoryData(commitData.software(), null), scrapedCommits, scrapedAt);
					softwareInfoRepository.saveCommitData(updatedData);
				} catch (RsdRateLimitException e) {
					// in case we hit the rate limit, we don't update the scraped_at time, so it gets scraped first next time
					System.out.println("Exception when handling data from url " + commitData.url() + ":");
					e.printStackTrace();
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + commitData.url() + ":");
					e.printStackTrace();
					CommitData oldDataWithUpdatedAt = new CommitData(new BasicRepositoryData(commitData.software(), null), null, scrapedAt);
					softwareInfoRepository.saveCommitData(oldDataWithUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
