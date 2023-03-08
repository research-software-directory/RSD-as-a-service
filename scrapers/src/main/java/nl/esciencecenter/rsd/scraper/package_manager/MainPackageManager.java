// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;

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
					e.printStackTrace();
				}
			}
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		} finally {
			executorService.shutdownNow();
		}
		System.out.println("Done scraping package manager data");

		// PackageManagerScraper pypiScraper = new PypiScraper("https://pypi.org/project/flask");
		// System.out.println("pypiScraper.downloads() = " + pypiScraper.downloads());
		// System.out.println("pypiScraper.reverseDependencies() = " + pypiScraper.reverseDependencies());
		//
		// PackageManagerScraper mavenScraper = new MavenScraper("https://mvnrepository.com/artifact/io.javalin/javalin");
		// // System.out.println("mavenScraper.downloads() = " + mavenScraper.downloads());
		// System.out.println("mavenScraper.reverseDependencies() = " + mavenScraper.reverseDependencies());
		//
		// PackageManagerScraper anacondaScraperScraper = new AnacondaScraper("https://anaconda.org/conda-forge/numpy/");
		// // System.out.println("anacondaScraperScraper.downloads() = " + anacondaScraperScraper.downloads());
		// System.out.println("anacondaScraperScraper.reverseDependencies() = " + anacondaScraperScraper.reverseDependencies());
		//
		// PackageManagerScraper npmScraper1 = new NpmScraper("https://www.npmjs.com/package/@lxcat/schema");
		// // System.out.println("npmScraper1.downloads() = " + npmScraper1.downloads());
		// System.out.println("npmScraper1.reverseDependencies() = " + npmScraper1.reverseDependencies());
		//
		// PackageManagerScraper npmScraper2 = new NpmScraper("https://www.npmjs.com/package/jest");
		// // System.out.println("npmScraper2.downloads() = " + npmScraper2.downloads());
		// System.out.println("npmScraper2.reverseDependencies() = " + npmScraper2.reverseDependencies());
		//
		// PackageManagerScraper cranScraper = new CranScraper("https://cran.r-project.org/web/packages/GGIR/index.html");
		// // System.out.println("cranScraper.downloads() = " + cranScraper.downloads());
		// System.out.println("cranScraper.reverseDependencies() = " + cranScraper.reverseDependencies());
	}

	static PackageManagerScraper scraperForType(PackageManagerType type, String url) {
		return switch (type) {
			case anaconda -> new AnacondaScraper(url);
			case cran -> new CranScraper(url);
			case dockerhub -> new DockerHubScraper(url);
			case maven -> new MavenScraper(url);
			case npm -> new NpmScraper(url);
			case pypi -> new PypiScraper(url);
			default -> throw new RuntimeException(type.name());
		};
	}

	static void scrapeDownloads(BasicPackageManagerData data, PostgrestConnector postgrestConnector, ZonedDateTime scrapedAt) {
		String packageManagerUrl = data.url();
		PackageManagerType type = data.type();

		PackageManagerScraper scraper = scraperForType(type, packageManagerUrl);
		Long downloads;
		try {
			downloads = scraper.downloads();
		} catch (RsdRateLimitException e) {
			e.printStackTrace();
			return;
		} catch (RuntimeException e) {
			e.printStackTrace();
			postgrestConnector.saveDownloadScrapedAtOnly(data.id(), scrapedAt);
			return;
		}
		postgrestConnector.saveDownloadCount(data.id(), downloads, scrapedAt);
	}

	static void scrapeReverseDependencies(BasicPackageManagerData data, PostgrestConnector postgrestConnector, ZonedDateTime scrapedAt) {
		String packageManagerUrl = data.url();
		PackageManagerType type = data.type();

		PackageManagerScraper scraper = scraperForType(type, packageManagerUrl);
		Integer revDeps;
		try {
			revDeps = scraper.reverseDependencies();
		} catch (RsdRateLimitException e) {
			e.printStackTrace();
			return;
		} catch (RuntimeException e) {
			e.printStackTrace();
			postgrestConnector.saveReverseDependencyScrapedAtOnly(data.id(), scrapedAt);
			return;
		}
		postgrestConnector.saveReverseDependencyCount(data.id(), revDeps, scrapedAt);
	}
}
