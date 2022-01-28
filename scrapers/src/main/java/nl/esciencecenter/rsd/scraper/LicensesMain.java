package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import nl.esciencecenter.rsd.scraper.language.FilterUrlOnlyPLRDecorator;
import nl.esciencecenter.rsd.scraper.language.GithubPL;
import nl.esciencecenter.rsd.scraper.language.LicenseData;
import nl.esciencecenter.rsd.scraper.language.OrderByDatePLRDecorator;
import nl.esciencecenter.rsd.scraper.language.PostgrestPLR;
import nl.esciencecenter.rsd.scraper.language.ProgrammingLanguagesRepository;

import java.time.LocalDateTime;
import java.util.Collection;

public class LicensesMain {

	public static void main(String[] args) {
		System.out.println("Start scraping licenses");
		ProgrammingLanguagesRepository existingLicensesSorted = new OrderByDatePLRDecorator(new FilterUrlOnlyPLRDecorator(new PostgrestPLR(Config.backendBaseUrl() + "/repository_url?select=id,software,url,license_scraped_at)"), "https://github.com"));
		Collection<LicenseData> dataToScrape = existingLicensesSorted.licenseData();
		JsonArray allDataToSave = new JsonArray();
		String scrapedAt = LocalDateTime.now().toString();
		int countRequests = 0;
		int maxRequests = Config.maxRequestsGithub();
		for (LicenseData licenseData : dataToScrape) {
			try {
				String repoUrl = licenseData.url();
				countRequests += 1;
				if (countRequests > maxRequests) break;
				String repo = repoUrl.replace("https://github.com/", "");
				if (repo.endsWith("/")) repo = repo.substring(0, repo.length() - 1);

				String scrapedJsonData = new GithubPL("https://api.github.com").license(repo);
				JsonObject newData = new JsonObject();
				newData.addProperty("id", licenseData.id());
//				we have to add all existing columns, otherwise PostgREST will not do the UPSERT
				newData.addProperty("software", licenseData.software());
				newData.addProperty("url", licenseData.url());
				newData.addProperty("license", scrapedJsonData);
				newData.addProperty("license_scraped_at", scrapedAt);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				e.printStackTrace();
			}
		}
		new PostgrestPLR(Config.backendBaseUrl() + "/repository_url").save(allDataToSave.toString());
		System.out.println("Done scraping licenses");
	}
}
