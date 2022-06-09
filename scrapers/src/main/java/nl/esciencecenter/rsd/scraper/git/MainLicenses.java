// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

public class MainLicenses {

	public static void main(String[] args) {
		System.out.println("Start scraping licenses");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping licenses");
	}

	private static void scrapeGitLab() {
		Collection<RepositoryUrlData> dataToScrape = getExistingLicenseData(CodePlatformProvider.GITLAB);
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		for (RepositoryUrlData licenseData : dataToScrape) {
			try {
				String repoUrl = licenseData.url();
				String hostname = new URI(repoUrl).getHost();
				String apiUrl = "https://" + hostname + "/api";
				String projectPath = repoUrl.replace("https://" + hostname + "/", "");
				if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

				String scrapedLicense = new GitLabSI(apiUrl, projectPath).license();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						licenseData.software(), licenseData.url(), CodePlatformProvider.GITLAB,
						scrapedLicense, scrapedAt,
						licenseData.commitHistory(), licenseData.commitHistoryScrapedAt(),
						licenseData.languages(), licenseData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + licenseData.url() + ":");
				e.printStackTrace();
			} catch (URISyntaxException e) {
				System.out.println("Error obtaining hostname of repository with url: " + licenseData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).save(updatedDataAll);
	}

	private static void scrapeGitHub() {
		Collection<RepositoryUrlData> dataToScrape = getExistingLicenseData(CodePlatformProvider.GITHUB);
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		for (RepositoryUrlData licenseData : dataToScrape) {
			try {
				String repoUrl = licenseData.url();
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedLicense = new GithubSI("https://api.github.com", repo).license();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						licenseData.software(), licenseData.url(), CodePlatformProvider.GITHUB,
						scrapedLicense, scrapedAt,
						licenseData.commitHistory(), licenseData.commitHistoryScrapedAt(),
						licenseData.languages(), licenseData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + licenseData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB).save(updatedDataAll);
	}

	/**
	 * Retrieve existing license data from database
	 * @param codePlatform The code platform as defined by SoftwareInfoRepository.CodePlatformProviders
	 * @return             Sorted data
	 */
	private static Collection<RepositoryUrlData> getExistingLicenseData(CodePlatformProvider codePlatform) {
		SoftwareInfoRepository existingLicensesSorted = new PostgrestSIR(Config.backendBaseUrl(), codePlatform);
		int limit = switch (codePlatform) {
			case GITHUB -> Config.maxRequestsGithub();
			case GITLAB -> Config.maxRequestsGitLab();
			default -> throw new IllegalStateException("Unexpected value: " + codePlatform);
		};
		return existingLicensesSorted.licenseData(limit);
	}
}
