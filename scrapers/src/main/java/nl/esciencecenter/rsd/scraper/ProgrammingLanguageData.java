package nl.esciencecenter.rsd.scraper;

import java.time.LocalDateTime;

public record ProgrammingLanguageData(String id, String url, LocalDateTime lastUpdated) {
}
