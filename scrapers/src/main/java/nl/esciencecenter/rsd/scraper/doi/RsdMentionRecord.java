// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.time.Instant;
import java.util.UUID;

public record RsdMentionRecord(
		UUID id,
		ExternalMentionRecord content,
		Instant scrapedAt
) {
}
