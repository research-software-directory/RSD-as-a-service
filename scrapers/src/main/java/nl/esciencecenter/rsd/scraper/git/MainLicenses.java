// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;

public class MainLicenses {

	public static void main(String[] args) {
		System.out.println("Start scraping licenses");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping licenses");
	}

	private static void scrapeGitLab() {
		Collection<BasicRepositoryData> dataToScrape = getExistingLicenseData(CodePlatformProvider.GITLAB);
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData licenseData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = licenseData.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					String scrapedLicense = new GitLabSI(apiUrl, projectPath).license();
					LicenseData updatedData = new LicenseData(new BasicRepositoryData(licenseData.software(), null), scrapedLicense, scrapedAt);
					new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).saveLicenseData(updatedData);
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + licenseData.url() + ":");
					e.printStackTrace();
					LicenseData oldDataWithUpdatedAt = new LicenseData(new BasicRepositoryData(licenseData.software(), null), null, scrapedAt);
					new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).saveLicenseData(oldDataWithUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGitHub() {
		Collection<BasicRepositoryData> dataToScrape = getExistingLicenseData(CodePlatformProvider.GITHUB);
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData licenseData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = licenseData.url();
					String repo = repoUrl.replace("https://github.com/", "");
					if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

					String scrapedLicense = new GithubSI("https://api.github.com", repo).license();
					LicenseData updatedData = new LicenseData(new BasicRepositoryData(licenseData.software(), null), scrapedLicense, scrapedAt);
					new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB).saveLicenseData(updatedData);
				} catch (RuntimeException e) {
					System.out.println("Exception when handling data from url " + licenseData.url() + ":");
					e.printStackTrace();
					LicenseData oldDataWithUpdatedAt = new LicenseData(new BasicRepositoryData(licenseData.software(), null), null, scrapedAt);
					new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB).saveLicenseData(oldDataWithUpdatedAt);
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	/**
	 * Retrieve existing license data from database
	 * @param codePlatform The code platform as defined by SoftwareInfoRepository.CodePlatformProviders
	 * @return             Sorted data
	 */
	private static Collection<BasicRepositoryData> getExistingLicenseData(CodePlatformProvider codePlatform) {
		SoftwareInfoRepository existingLicensesSorted = new PostgrestSIR(Config.backendBaseUrl(), codePlatform);
		int limit = switch (codePlatform) {
			case GITHUB -> Config.maxRequestsGithub();
			case GITLAB -> Config.maxRequestsGitLab();
			default -> throw new IllegalStateException("Unexpected value: " + codePlatform);
		};
		return existingLicensesSorted.licenseData(limit);
	}
}
