package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.Collection;

public class MainProgrammingLanguages {


	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		SoftwareInfoRepository existingLanguagesSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl() + "/repository_url?select=id,url,programming_languages(updated_at)"), "https://github.com"));
		Collection<RepositoryUrlData> dataToScrape = existingLanguagesSorted.data();
		JsonArray allDataToSave = new JsonArray();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (RepositoryUrlData repositoryUrlData : dataToScrape) {
			try {
				String repoUrl = repositoryUrlData.url();
				if (!repoUrl.startsWith("https://github.com/")) continue;
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedJsonData = new GithubSI("https://api.github.com").data(repo);
				JsonObject newData = new JsonObject();
				newData.addProperty("repository_url", repositoryUrlData.id());
				newData.addProperty("languages", scrapedJsonData);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/programming_languages").save(allDataToSave.toString());
		System.out.println("Done scraping programming languages");
	}
}
