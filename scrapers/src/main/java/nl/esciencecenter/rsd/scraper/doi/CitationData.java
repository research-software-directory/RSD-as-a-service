// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;
import java.util.UUID;

/**
 * Container class for Citation information retrieved from the database.
 */
public record CitationData(
		// UUID of this entry in the database
		UUID id,

		// DOI of this entry.
		Doi doi,

		// OpenAlex ID of this entry
		OpenalexId openalexId,

		// List of known DOIs citing this entry.
		Collection<Doi> knownDois
) {
}
