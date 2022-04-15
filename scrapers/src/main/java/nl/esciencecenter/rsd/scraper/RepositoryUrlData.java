package nl.esciencecenter.rsd.scraper;

import java.time.LocalDateTime;

public record RepositoryUrlData(String software, String url, CodePlatformProvider code_platform,
								String license, LocalDateTime licenseScrapedAt,
								String commitHistory, LocalDateTime commitHistoryScrapedAt,
								String languages, LocalDateTime languagesScrapedAt) {
}
