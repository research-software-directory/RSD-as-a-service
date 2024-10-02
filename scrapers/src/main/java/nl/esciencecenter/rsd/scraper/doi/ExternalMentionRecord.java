// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.net.URI;
import java.time.ZonedDateTime;

public record ExternalMentionRecord(
		Doi doi,
		ZonedDateTime doiRegistrationDate,
		OpenalexId openalexId,
		URI url,
		String title,
		String authors,
		String publisher,
		Integer publicationYear,
		String journal,
		String page,
		MentionType mentionType,
		String source,
		String version
) {
}
