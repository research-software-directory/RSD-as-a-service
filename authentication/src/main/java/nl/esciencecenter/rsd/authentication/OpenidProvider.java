// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

public enum OpenidProvider {
	local,
	surfconext,
	helmholtz,
	orcid,
	azure,
	linkedin;

	public String toUserFriendlyString() {
		return switch (this) {
			case local -> "local accounts";
			case surfconext -> "SURFconext";
			case helmholtz -> "Helmholtz";
			case orcid -> "ORCID";
			case azure -> "Azure";
			case linkedin -> "LinkedIn";
		};
	}
}
