package nl.esciencecenter.rsd.scraper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		SoftwareInfoRepository existingCommitsSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl()), "https://github.com"));
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
				RepositoryUrlData updatedData = new RepositoryUrlData(commitData.software(), commitData.url(),
						commitData.license(), commitData.licenseScrapedAt(),
						scrapedCommits, scrapedAt,
						commitData.languages(), commitData.languagesScrapedAt());
				updatedDataAll.add(updatedData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url").save(updatedDataAll);
		System.out.println("Done scraping commits");
	}
}
