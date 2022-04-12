package nl.esciencecenter.rsd.scraper;

import nl.esciencecenter.rsd.scraper.SoftwareInfoRepository.CodePlatformProvider;

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
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGitLab();
		for (RepositoryUrlData licenseData : dataToScrape) {
			try {
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repoUrl = licenseData.url();
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

				String scrapedLicense = new GitLabSI(apiUrl, projectPath).license();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						licenseData.software(), licenseData.url(), "gitlab",
						scrapedLicense, scrapedAt,
						licenseData.commitHistory(), licenseData.commitHistoryScrapedAt(),
						licenseData.languages(), licenseData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + licenseData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url", CodePlatformProvider.GITLAB).save(updatedDataAll);
	}

	private static void scrapeGitHub() {
		Collection<RepositoryUrlData> dataToScrape = getExistingLicenseData(CodePlatformProvider.GITHUB);
		Collection<RepositoryUrlData> updatedDataAll = new ArrayList<>();
		LocalDateTime scrapedAt = LocalDateTime.now();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (RepositoryUrlData licenseData : dataToScrape) {
			try {
				String repoUrl = licenseData.url();
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedLicense = new GithubSI("https://api.github.com", repo).license();
				RepositoryUrlData updatedData = new RepositoryUrlData(
						licenseData.software(), licenseData.url(), "github",
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
	 * @param codePlatform The code platform as defined by SoftwareInfoRepository.codePlatformProviders
	 * @return             Sorted data
	 */
	private static Collection<RepositoryUrlData> getExistingLicenseData(CodePlatformProvider codePlatform) {
		SoftwareInfoRepository existingLicensesSorted = new OrderByDateSIRDecorator(new PostgrestSIR(Config.backendBaseUrl(), codePlatform));
		return existingLicensesSorted.licenseData();
	}
}
