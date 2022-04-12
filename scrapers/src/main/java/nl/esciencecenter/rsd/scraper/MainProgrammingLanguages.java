package nl.esciencecenter.rsd.scraper;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import nl.esciencecenter.rsd.scraper.SoftwareInfoRepository.codePlatformProvider;

public class MainProgrammingLanguages {

	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		scrapeGithub();
		scrapeGitLab();
		System.out.println("Done scraping programming languages");
	}

	private static void scrapeGitLab() {
		SoftwareInfoRepository existingLanguagesSorted = new OrderByDateSIRDecorator(new PostgrestSIR(Config.backendBaseUrl(), codePlatformProvider.gitlab));
		Collection<RepositoryUrlData> dataToScrape = existingLanguagesSorted.languagesData();
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (RepositoryUrlData programmingLanguageData : dataToScrape) {
			try {
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repoUrl = programmingLanguageData.url();
				String hostname = "";
				try {
					hostname = new URI(repoUrl).getHost();
				} catch (URISyntaxException e) {
					System.out.println("Error obtaining hostname of repository with url: " + repoUrl);
					e.printStackTrace();
				}
				String apiUrl = "https://" + hostname + "/api";
				String projectPath = repoUrl.replace("https://" + hostname + "/", "");
				if (projectPath.endsWith("/")) projectPath = projectPath.substring(0, projectPath.length() - 1);

				String scrapedLanguages = new GitLabSI(apiUrl, projectPath).languages();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						programmingLanguageData.software(), programmingLanguageData.url(), "github",
						programmingLanguageData.license(), programmingLanguageData.licenseScrapedAt(),
						programmingLanguageData.commitHistory(), programmingLanguageData.commitHistoryScrapedAt(),
						scrapedLanguages, scrapedAt);
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", codePlatformProvider.github).save(updatedDataAll);
	}

	private static void scrapeGithub() {
		SoftwareInfoRepository existingLanguagesSorted = new OrderByDateSIRDecorator(new PostgrestSIR(Config.backendBaseUrl(), codePlatformProvider.github));
		Collection<RepositoryUrlData> dataToScrape = existingLanguagesSorted.languagesData();
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
						programmingLanguageData.software(), programmingLanguageData.url(), "github",
						programmingLanguageData.license(), programmingLanguageData.licenseScrapedAt(),
						programmingLanguageData.commitHistory(), programmingLanguageData.commitHistoryScrapedAt(),
						scrapedLanguages, scrapedAt);
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", codePlatformProvider.github).save(updatedDataAll);
	}
}
