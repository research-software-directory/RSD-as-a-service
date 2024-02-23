// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.time.ZonedDateTime;

public record BasicOrganisationDatabaseData(
	BasicOrganisationData basicData,
	ZonedDateTime rorScrapedAt
) {
}
