package nl.esciencecenter.rsd.scraper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import nl.esciencecenter.rsd.scraper.SoftwareInfoRepository.codePlatformProvider;

public class MainProgrammingLanguages {

	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		scrapeGithub();
		System.out.println("Done scraping programming languages");
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
