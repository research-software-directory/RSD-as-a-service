// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.net.URI;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.UUID;

public class MentionRecord {
	UUID id;
	String doi;
	URI url;
	String title;
	String authors;
	String publisher;
	Integer publicationYear;
	ZonedDateTime doiRegistrationDate;
	String journal;
	String page;
	URI imageUrl;
	MentionType mentionType;
	String source;
	Instant scrapedAt;
	String version;
}
