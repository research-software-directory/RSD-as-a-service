package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.time.LocalDateTime;
import java.util.Collection;

public class MainCommits {

	public static void main(String[] args) {
		System.out.println("Start scraping commits");
		SoftwareInfoRepository existingCommitsSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl()), "https://github.com"));
		Collection<RepositoryUrlData> dataToScrape = existingCommitsSorted.commitData();
		JsonArray allDataToSave = new JsonArray();
		String scrapedAt = LocalDateTime.now().toString();
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
				JsonObject newData = new JsonObject();
				newData.addProperty("id", commitData.id());
//				we have to add all existing columns, otherwise PostgREST will not do the UPSERT
				newData.addProperty("software", commitData.software());
				newData.addProperty("url", commitData.url());
				newData.addProperty("license", commitData.license());
				newData.addProperty("license_scraped_at", commitData.licenseScrapedAt() == null ? null : commitData.licenseScrapedAt().toString());
				newData.addProperty("commit_history", scrapedCommits);
				newData.addProperty("commit_history_scraped_at", scrapedAt);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + commitData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url").save(allDataToSave.toString());
		System.out.println("Done scraping commits");
	}
}
