// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.util.List;

public record RorData(
	String country,
	String city,
	String wikipediaUrl,
	List<String> rorTypes,
	Double lat,
	Double lon
) {
}
