package nl.esciencecenter.rsd.scraper;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import nl.esciencecenter.rsd.scraper.SoftwareInfoRepository.codePlatformProvider;

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		scrapeGitHub();
		scrapeGitLab();
		System.out.println("Done scraping commits");
	}

	private static void scrapeGitLab() {
		SoftwareInfoRepository existingCommitsSorted = new OrderByDateSIRDecorator(new PostgrestSIR(Config.backendBaseUrl(), codePlatformProvider.github));
		Collection<RepositoryUrlData> dataToScrape = existingCommitsSorted.commitData();
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGitLab();
		for (RepositoryUrlData commitData : dataToScrape) {
			try {
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repoUrl = commitData.url();
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

				String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(new GitLabSI(apiUrl, projectPath)).contributionsGitLab();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						commitData.software(), commitData.url(), "gitlab",
						commitData.license(), commitData.licenseScrapedAt(),
						scrapedCommits, scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", codePlatformProvider.gitlab).save(updatedDataAll);
	}

	private static void scrapeGitHub() {
		SoftwareInfoRepository existingCommitsSorted = new OrderByDateSIRDecorator(new PostgrestSIR(Config.backendBaseUrl(), codePlatformProvider.github));
		Collection<RepositoryUrlData> dataToScrape = existingCommitsSorted.commitData();
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (RepositoryUrlData commitData : dataToScrape) {
			try {
				String repoUrl = commitData.url();
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedCommits = new AggregateContributionsPerWeekSIDecorator(new GithubSI("https://api.github.com", repo)).contributions();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						commitData.software(), commitData.url(), "github",
						commitData.license(), commitData.licenseScrapedAt(),
						scrapedCommits, scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", codePlatformProvider.github).save(updatedDataAll);
	}
}
