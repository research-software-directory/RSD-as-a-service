package nl.esciencecenter.rsd.scraper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.time.LocalDateTime;
import java.util.Collection;

public class MainLicenses {

	public static void main(String[] args) {
		System.out.println("Start scraping licenses");
		SoftwareInfoRepository existingLicensesSorted = new OrderByDateSIRDecorator(new FilterUrlOnlySIRDecorator(new PostgrestSIR(Config.backendBaseUrl()), "https://github.com"));
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

				String scrapedLicense = new GithubSI("https://api.github.com", repo).license();
				JsonObject newData = new JsonObject();
				newData.addProperty("id", licenseData.id());
//				we have to add all existing columns, otherwise PostgREST will not do the UPSERT
				newData.addProperty("software", licenseData.software());
				newData.addProperty("url", licenseData.url());
				newData.addProperty("license", scrapedLicense);
				newData.addProperty("license_scraped_at", scrapedAt);
				allDataToSave.add(newData);
			} catch (RuntimeException e) {
				e.printStackTrace();
			}
		}
		new PostgrestSIR(Config.backendBaseUrl() + "/repository_url").save(allDataToSave.toString());
		System.out.println("Done scraping licenses");
	}
}
