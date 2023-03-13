// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.time.ZonedDateTime;

public record ContributorDatabaseData(
		BasicRepositoryData basicData,
		Integer contributorCount,
		ZonedDateTime dataScrapedAt
) {
}
