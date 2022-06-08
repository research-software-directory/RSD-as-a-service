package nl.esciencecenter.rsd.scraper.doi;

import java.net.URI;
import java.time.Instant;
import java.util.UUID;

public class MentionRecord {
	UUID id;
	String doi;
	URI url;
	String title;
	String authors;
	String publisher;
	Integer publicationYear;
	String page;
	URI imageUrl;
	MentionType mentionType;
	String source;
	Instant scrapedAt;
}
