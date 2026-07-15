// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.util.Locale;

public enum CodePlatformProvider {
	GITHUB,
	GITLAB,
	BITBUCKET,
	FOURTU,
	CODEBERG,
	OTHER;

	/**
	 *
	 * @return a string matching the enum "platform_type" in the database
	 */
	public String toDatabaseString() {
		if (this == FOURTU) {
			return "4tu";
		}

		return this.name().toLowerCase(Locale.ENGLISH);
	}
}
