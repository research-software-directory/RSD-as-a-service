// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.util.Optional;

public class Config {

	private static final long TEN_MINUTES_IN_MILLISECONDS = 600_000L; // 10 * 60 * 1000

	public static String jwtSigningSecret() {
		return System.getenv("PGRST_JWT_SECRET");
	}

	public static long jwtExpirationTime() {
		return TEN_MINUTES_IN_MILLISECONDS;
	}

	public static String backendBaseUrl() {
		return System.getenv("POSTGREST_URL");
	}

	public static int maxRequestsGithub() {
		String valueAsString = System.getenv("MAX_REQUESTS_GITHUB");
		return valueAsString == null ? 6 : Integer.parseInt(valueAsString);
	}

	public static Optional<String> apiCredentialsGithub() {
		return Optional.ofNullable(System.getenv("API_CREDENTIALS_GITHUB"));
	}

	/**
	 * The maximum requests rate for GitLab.
	 * @return Maximum request rate (default 6).
	 */
	public static int maxRequestsGitLab() {
		String valueAsString = System.getenv("MAX_REQUESTS_GITLAB");
		return valueAsString == null ? 6 : Integer.parseInt(valueAsString);
	}

	public static int maxRequestsDoi() {
		String valueAsString = System.getenv("MAX_REQUESTS_DOI");
		return valueAsString == null ? 6 : Integer.parseInt(valueAsString);
	}

	public static Optional<String> crossrefContactEmail() {
		String possibleEMail = System.getenv("CROSSREF_CONTACT_EMAIL");
		return possibleEMail == null || possibleEMail.isBlank() ? Optional.empty() : Optional.of(possibleEMail.strip());
	}
}
