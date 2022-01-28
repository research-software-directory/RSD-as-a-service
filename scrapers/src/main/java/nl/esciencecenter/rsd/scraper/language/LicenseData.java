package nl.esciencecenter.rsd.scraper.language;

import java.time.LocalDateTime;

public record LicenseData(String id, String software, String url, LocalDateTime lastUpdated) {
}
