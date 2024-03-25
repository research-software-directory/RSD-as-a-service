// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
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

public class MainProgrammingLanguages {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainProgrammingLanguages.class);

	public static void main(String[] args) {

		LOGGER.info("Start scraping programming languages");

		long t1 = System.currentTimeMillis();

		scrapeGithub();
		scrapeGitLab();
		scrape4tu();

		long time = System.currentTimeMillis() - t1;

		LOGGER.info("Done scraping programming languages ({} ms.)", time);
	}

	private static void scrapeGitLab() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.languagesData(Config.maxRequestsGitLab());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData programmingLanguageData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = programmingLanguageData.url();
					String hostname = URI.create(repoUrl).getHost();
					String apiUrl = "https://" + hostname + "/api";
					String projectPath = repoUrl.replace("https://" + hostname + "/", "");
					if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

					String scrapedLanguages = new GitlabScraper(apiUrl, projectPath).languages();
					LanguagesData updatedData = new LanguagesData(new BasicRepositoryData(programmingLanguageData.software(), null), scrapedLanguages, scrapedAt);
					softwareInfoRepository.saveLanguagesData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitLab programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitLab programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitLab programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrapeGithub() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.languagesData(Config.maxRequestsGithub());
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData programmingLanguageData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = programmingLanguageData.url();

					Optional<GithubScraper> githubScraperOptional = GithubScraper.create(repoUrl);
					if (githubScraperOptional.isEmpty()) {
						Utils.saveErrorMessageInDatabase("Not a valid GitHub URL: " + repoUrl, "repository_url", "languages_last_error", programmingLanguageData.software()
							.toString(), "software", scrapedAt, "languages_scraped_at");
						return;
					}

					GithubScraper githubScraper = githubScraperOptional.get();
					String scrapedLanguages = githubScraper.languages();
					LanguagesData updatedData = new LanguagesData(new BasicRepositoryData(programmingLanguageData.software(), null), scrapedLanguages, scrapedAt);
					softwareInfoRepository.saveLanguagesData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("GitHub programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("GitHub programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("GitHub programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}

	private static void scrape4tu() {
		PostgrestConnector softwareInfoRepository = new PostgrestConnector(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.FOURTU);
		Collection<BasicRepositoryData> dataToScrape = softwareInfoRepository.languagesData(10);
		CompletableFuture<?>[] futures = new CompletableFuture[dataToScrape.size()];
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		int i = 0;
		for (BasicRepositoryData programmingLanguageData : dataToScrape) {
			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
				try {
					String repoUrl = programmingLanguageData.url();

					FourTuGitScraper fourTuGitScraper = new FourTuGitScraper(repoUrl);
					String scrapedLanguages = fourTuGitScraper.languages();
					LanguagesData updatedData = new LanguagesData(new BasicRepositoryData(programmingLanguageData.software(), null), scrapedLanguages, scrapedAt);
					softwareInfoRepository.saveLanguagesData(updatedData);
				} catch (RsdRateLimitException e) {
					Utils.saveExceptionInDatabase("4TU programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", null, null);
				} catch (RsdResponseException e) {
					Utils.saveExceptionInDatabase("4TU programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase(e.getMessage(), "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				} catch (Exception e) {
					Utils.saveExceptionInDatabase("4TU programming languages scraper", "repository_url", programmingLanguageData.software(), e);
					Utils.saveErrorMessageInDatabase("Unknown error", "repository_url", "languages_last_error", programmingLanguageData.software()
						.toString(), "software", scrapedAt, "languages_scraped_at");
				}
			});
			futures[i] = future;
			i++;
		}
		CompletableFuture.allOf(futures).join();
	}
}
