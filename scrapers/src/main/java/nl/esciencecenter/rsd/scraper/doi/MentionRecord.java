// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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
	boolean isFeatured;
	MentionType mentionType;
	String source;
	Integer version;
	String zoteroKey;
	Instant scrapedAt;
}
