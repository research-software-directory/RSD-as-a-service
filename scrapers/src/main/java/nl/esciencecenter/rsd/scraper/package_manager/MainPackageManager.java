// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class MainPackageManager {

	public static void main(String[] args) {
		System.out.println("Start scraping package manager data");
		PostgrestConnector postgrestConnector = new PostgrestConnector(Config.backendBaseUrl() + "/package_manager");
		Collection<BasicPackageManagerData> downloadsToScrape = postgrestConnector.oldestDownloadCounts(10);
		Collection<BasicPackageManagerData> revDepsToScrape = postgrestConnector.oldestReverseDependencyCounts(10);
		Collection<Callable<Void>> tasks = new ArrayList<>();
		ZonedDateTime scrapedAt = ZonedDateTime.now();
		for (BasicPackageManagerData basicData : downloadsToScrape) {
			Callable<Void> task = () -> {
				scrapeDownloads(basicData, postgrestConnector, scrapedAt);
				return null;
			};
			tasks.add(task);
		}
		for (BasicPackageManagerData basicData : revDepsToScrape) {
			Callable<Void> task = () -> {
				scrapeReverseDependencies(basicData, postgrestConnector, scrapedAt);
				return null;
			};
			tasks.add(task);
		}
		ExecutorService executorService = Executors.newCachedThreadPool();
		try {
			List<Future<Void>> completedTasks = executorService.invokeAll(tasks);
			for (Future<Void> completedTask : completedTasks) {
				try {
					completedTask.get();
				} catch (ExecutionException e) {
					Utils.saveExceptionInDatabase("Package manager scraper", "package_manager", null, e);
				}
			}
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		} finally {
			executorService.shutdownNow();
		}
		System.out.println("Done scraping package manager data");
	}

	static PackageManagerScraper scraperForType(PackageManagerType type, String url) {
		return switch (type) {
			case anaconda -> new AnacondaScraper(url);
			case cran -> new CranScraper(url);
			case dockerhub -> new DockerHubScraper(url);
			case maven -> new MavenScraper(url);
			case npm -> new NpmScraper(url);
			case pypi -> new PypiScraper(url);
			case other -> throw new RuntimeException("Package manager scraper requested for 'other'");
		};
	}

	static void scrapeDownloads(BasicPackageManagerData data, PostgrestConnector postgrestConnector, ZonedDateTime scrapedAt) {
		String packageManagerUrl = data.url();
		PackageManagerType type = data.type();

		Long downloads;
		try {
			PackageManagerScraper scraper = scraperForType(type, packageManagerUrl);
			downloads = scraper.downloads();
			postgrestConnector.saveDownloadCount(data.id(), downloads, scrapedAt);
		} catch (RsdRateLimitException e) {
			Utils.saveExceptionInDatabase("Package manager downloads scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase(e.getMessage(), "package_manager", "download_count_last_error", data.id().toString(), "id", null, null);
		} catch (RsdResponseException e) {
			Utils.saveExceptionInDatabase("Package manager downloads scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase(e.getMessage(), "package_manager", "download_count_last_error", data.id().toString(), "id", scrapedAt, "download_count_scraped_at");
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("Package manager downloads scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase("Unknown error", "package_manager", "download_count_last_error", data.id().toString(), "id", scrapedAt, "download_count_scraped_at");
		}
	}

	static void scrapeReverseDependencies(BasicPackageManagerData data, PostgrestConnector postgrestConnector, ZonedDateTime scrapedAt) {
		String packageManagerUrl = data.url();
		PackageManagerType type = data.type();

		Integer revDeps;
		try {
			PackageManagerScraper scraper = scraperForType(type, packageManagerUrl);
			revDeps = scraper.reverseDependencies();
			postgrestConnector.saveReverseDependencyCount(data.id(), revDeps, scrapedAt);
		} catch (RsdRateLimitException e) {
			Utils.saveExceptionInDatabase("Package manager reverse dependencies scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase(e.getMessage(), "package_manager", "reverse_dependency_count_last_error", data.id().toString(), "id", null, null);
		} catch (RsdResponseException e) {
			Utils.saveExceptionInDatabase("Package manager reverse dependencies scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase(e.getMessage(), "package_manager", "reverse_dependency_count_last_error", data.id().toString(), "id", scrapedAt, "reverse_dependency_count_scraped_at");
		} catch (RuntimeException e) {
			Utils.saveExceptionInDatabase("Package manager reverse dependencies scraper", "package_manager", data.id(), e);
			Utils.saveErrorMessageInDatabase("Unknown error", "package_manager", "reverse_dependency_count_last_error", data.id().toString(), "id", scrapedAt, "reverse_dependency_count_scraped_at");
		}
	}
}
