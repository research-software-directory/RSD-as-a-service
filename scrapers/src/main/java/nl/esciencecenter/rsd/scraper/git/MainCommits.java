// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping commits");
	}

	private static void scrapeGitLab() {
		SoftwareInfoRepository existingCommitsSorted = new PostgrestSIR(Config.backendBaseUrl(), CodePlatformProvider.GITLAB);
		Collection<RepositoryUrlData> dataToScrape = existingCommitsSorted.commitData(Config.maxRequestsGitLab());
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		for (RepositoryUrlData commitData : dataToScrape) {
			try {
				String repoUrl = commitData.url();
				String hostname = URI.create(repoUrl).getHost();
				String apiUrl = "https://" + hostname + "/api";
				String projectPath = repoUrl.replace("https://" + hostname + "/", "");
				if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

				String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(new GitLabSI(apiUrl, projectPath), CodePlatformProvider.GITLAB).contributions();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						commitData.software(), commitData.url(), CodePlatformProvider.GITLAB,
						commitData.license(), commitData.licenseScrapedAt(),
						scrapedCommits, scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException  e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
				RepositoryUrlData oldDataWithUpdatedAt = new RepositoryUrlData(
						commitData.software(), commitData.url(), CodePlatformProvider.GITLAB,
						commitData.license(), commitData.licenseScrapedAt(),
						commitData.commitHistory(), scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(oldDataWithUpdatedAt);
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).save(updatedDataAll);
	}

	private static void scrapeGitHub() {
		SoftwareInfoRepository existingCommitsSorted = new PostgrestSIR(Config.backendBaseUrl(), CodePlatformProvider.GITHUB);
		Collection<RepositoryUrlData> dataToScrape = existingCommitsSorted.commitData(Config.maxRequestsGithub());
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		for (RepositoryUrlData commitData : dataToScrape) {
			try {
				String repoUrl = commitData.url();
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(new GithubSI("https://api.github.com", repo), CodePlatformProvider.GITHUB).contributions();
//				this happens on 202 response, keep the old value
				if (scrapedCommits == null) scrapedCommits = commitData.commitHistory();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						commitData.software(), commitData.url(), CodePlatformProvider.GITHUB,
						commitData.license(), commitData.licenseScrapedAt(),
						scrapedCommits, scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
				RepositoryUrlData oldDataWithUpdatedAt = new RepositoryUrlData(
						commitData.software(), commitData.url(), CodePlatformProvider.GITHUB,
						commitData.license(), commitData.licenseScrapedAt(),
						commitData.commitHistory(), scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(oldDataWithUpdatedAt);
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB).save(updatedDataAll);
	}
}
