package nl.esciencecenter.rsd.scraper.language;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import nl.esciencecenter.rsd.scraper.Config;

import java.util.Collection;

public class Main {


	public static void main(String[] args) {
		System.out.println("Start scraping programming languages");
		ProgrammingLanguagesRepository existingLanguagesSorted = new OrderByDatePLRDecorator(new FilterUrlOnlyPLRDecorator(new PostgrestPLR(Config.backendBaseUrl() + "/repository_url?select=id,url,programming_languages(languages,updated_at)"), "https://github.com"));
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

				String scrapedJsonData = new GithubPL("https://api.github.com").data(repo);
				JsonObject newData = new JsonObject();
				newData.addProperty("repository_url", repositoryUrlData.id());
				newData.addProperty("languages", scrapedJsonData);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				e.printStackTrace();
			}
		}
		new PostgrestPLR(Config.backendBaseUrl() + "/programming_languages").save(allDataToSave.toString());
		System.out.println("Done scraping programming languages");
	}
}
