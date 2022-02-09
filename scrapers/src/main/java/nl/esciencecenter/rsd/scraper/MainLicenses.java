package nl.esciencecenter.rsd.scraper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

public class MainLicenses {

	public static void main(String[] args) {
		System.out.println("Start scraping licenses");
		SoftwareInfoRepository existingLicensesSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl()), "https://github.com"));
		Collection<RepositoryUrlData> dataToScrape = existingLicensesSorted.licenseData();
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
				RepositoryUrlData updatedData = new RepositoryUrlData(licenseData.software(), licenseData.url(),
						scrapedLicense, scrapedAt,
						licenseData.commitHistory(), licenseData.commitHistoryScrapedAt(),
						licenseData.languages(), licenseData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + licenseData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url").save(updatedDataAll);
		System.out.println("Done scraping licenses");
	}
}
