// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.util.UUID;

public record BasicRepositoryDataWithHistory(UUID software, String url, String commitHistoryScrapedAt, CommitsPerWeek commitsPerWeek) {
}
