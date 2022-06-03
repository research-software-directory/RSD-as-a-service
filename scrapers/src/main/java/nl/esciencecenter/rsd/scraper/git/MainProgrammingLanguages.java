package nl.esciencecenter.rsd.scraper.git;

import nl.esciencecenter.rsd.scraper.Config;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

public class MainProgrammingLanguages {

	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		scrapeGithub();
		scrapeGitLab();
		System.out.println("Done scraping programming languages");
	}

	private static void scrapeGitLab() {
		SoftwareInfoRepository existingLanguagesSorted = new PostgrestSIR(Config.backendBaseUrl(), CodePlatformProvider.GITLAB);
		Collection<RepositoryUrlData> dataToScrape = existingLanguagesSorted.languagesData(Config.maxRequestsGitLab());
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		for (RepositoryUrlData programmingLanguageData : dataToScrape) {
			try {
				String repoUrl = programmingLanguageData.url();
				String hostname = new URI(repoUrl).getHost();
				String apiUrl = "https://" + hostname + "/api";
				String projectPath = repoUrl.replace("https://" + hostname + "/", "");
				if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

				String scrapedLanguages = new GitLabSI(apiUrl, projectPath).languages();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						programmingLanguageData.software(), programmingLanguageData.url(), CodePlatformProvider.GITLAB,
						programmingLanguageData.license(), programmingLanguageData.licenseScrapedAt(),
						programmingLanguageData.commitHistory(), programmingLanguageData.commitHistoryScrapedAt(),
						scrapedLanguages, scrapedAt);
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			} catch (URISyntaxException e) {
				System.out.println("Error obtaining hostname of repository with url: " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			}

		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).save(updatedDataAll);
	}

	private static void scrapeGithub() {
		SoftwareInfoRepository existingLanguagesSorted = new PostgrestSIR(Config.backendBaseUrl(), CodePlatformProvider.GITHUB);
		Collection<RepositoryUrlData> dataToScrape = existingLanguagesSorted.languagesData(Config.maxRequestsGithub());
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (RepositoryUrlData programmingLanguageData : dataToScrape) {
			try {
				String repoUrl = programmingLanguageData.url();
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedLanguages = new GithubSI("https://api.github.com", repo).languages();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						programmingLanguageData.software(), programmingLanguageData.url(), CodePlatformProvider.GITHUB,
						programmingLanguageData.license(), programmingLanguageData.licenseScrapedAt(),
						programmingLanguageData.commitHistory(), programmingLanguageData.commitHistoryScrapedAt(),
						scrapedLanguages, scrapedAt);
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITHUB).save(updatedDataAll);
	}
}
