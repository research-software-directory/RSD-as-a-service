// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.net.URI;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.UUID;

public class MentionRecord {
	public UUID id;
	public String doi;
	public URI url;
	public String title;
	public String authors;
	public String publisher;
	public Integer publicationYear;
	public ZonedDateTime doiRegistrationDate;
	public String journal;
	public String page;
	public URI imageUrl;
	public MentionType mentionType;
	public String externalId;
	public String source;
	public Instant scrapedAt;
	public String version;

	@Override
	public String toString() {
		return "MentionRecord{" +
				"id=" + id +
				", doi='" + doi + '\'' +
				", url=" + url +
				", title='" + title + '\'' +
				", authors='" + authors + '\'' +
				", publisher='" + publisher + '\'' +
				", publicationYear=" + publicationYear +
				", doiRegistrationDate=" + doiRegistrationDate +
				", journal='" + journal + '\'' +
				", page='" + page + '\'' +
				", imageUrl=" + imageUrl +
				", mentionType=" + mentionType +
				", externalId='" + externalId + '\'' +
				", source='" + source + '\'' +
				", scrapedAt=" + scrapedAt +
				", version='" + version + '\'' +
				'}';
	}
}
