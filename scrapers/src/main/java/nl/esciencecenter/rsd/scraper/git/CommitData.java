// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.time.ZonedDateTime;

public record CommitData(
	BasicRepositoryData basicData,
	CommitsPerWeek commitHistory,
	ZonedDateTime commitHistoryScrapedAt
) {
}
