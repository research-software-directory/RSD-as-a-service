package nl.esciencecenter.rsd.scraper.language;

import java.time.LocalDateTime;

public record RepositoryUrlData(String id, String url, String jsonData, LocalDateTime lastUpdated) {
}
