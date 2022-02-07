package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.Collection;

public class MainProgrammingLanguages {


	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		SoftwareInfoRepository existingLanguagesSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl()), "https://github.com"));
		Collection<ProgrammingLanguageData> dataToScrape = existingLanguagesSorted.repositoryUrlData();
		JsonArray allDataToSave = new JsonArray();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (ProgrammingLanguageData programmingLanguageData : dataToScrape) {
			try {
				String repoUrl = programmingLanguageData.url();
				if (!repoUrl.startsWith("https://github.com/")) continue;
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedJsonData = new GithubSI("https://api.github.com", repo).languages();
				JsonObject newData = new JsonObject();
				newData.addProperty("repository_url", programmingLanguageData.id());
				newData.addProperty("languages", scrapedJsonData);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				System.out.println("Exception when handling data from url " + programmingLanguageData.url() + ":");
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/programming_languages").save(allDataToSave.toString());
		System.out.println("Done scraping programming languages");
	}
}
