// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.util.Optional;

public record RsdContributor(
	String givenNames,
	String familyNames,
	Optional<String> affiliation,
	Optional<String> orcid,
	int position
) {}
