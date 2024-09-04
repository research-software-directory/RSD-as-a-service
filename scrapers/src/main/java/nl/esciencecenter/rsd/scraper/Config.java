// SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

/**
 * Helper class to retrieve various environment variables.
 */
public class Config {

	private static final long TEN_MINUTES_IN_MILLISECONDS = 10L * 60L * 1000L;

	private static final Logger LOGGER = LoggerFactory.getLogger(Config.class);

	private Config() {
	}

	/**
	 * Retrieves the value of the environment variable with the given name. Variable is not allowed to unset, and an Error
	 * will be thrown if this is the case.
	 *
	 * @param name the name of the variable.
	 * @return the value of the variable.
	 */
	private static String getMandatoryEnv(String name) {

		if (name == null || name.isBlank()) {
			LOGGER.error("Attempting to retrieve mandatory environment variable without a name!");
			throw new Error("Attempting to retrieve mandatory environment variable without a name!");
		}

		String value;

		try {
			value = System.getenv(name);
		} catch (Exception e) {
			LOGGER.error("Failed to retrieve environment variable: {}", name, e);
			throw new Error("Failed to retrieve environment variable: " + name, e);
		}

		if (value == null || value.isBlank()) {
			LOGGER.error("Blank environment variable: {}", name);
			throw new Error("Failed to retrieve environment variable: " + name);
		}

		return value;
	}

	/**
	 * Retrieves the value of the environment variable with the given name. Allows the variable to be unset.
	 *
	 * @param name the name of the variable.
	 * @return the value of the variable if set, or empty Optional otherwise.
	 */
	private static Optional<String> getOptionalEnv(String name) {

		if (name == null || name.isBlank()) {
			LOGGER.warn("Attempting to retrieve environment variable without a name!");
			return Optional.empty();
		}

		try {
			String value = System.getenv(name);
			return (value == null || value.isBlank()) ? Optional.empty() : Optional.of(value.strip());
		} catch (Exception e) {
			LOGGER.warn("Failed to retrieve environment variable: {}", name, e);
			return Optional.empty();
		}
	}

	/**
	 * Retrieves the integer value of the environment variable with the given name. When the variable is unset, empty
	 * or contains an invalid value, the default value is returned.
	 *
	 * @param name         the name of the variable.
	 * @param defaultValue the default value to return if the environment variable is unset, empty, or does not contain an integer.
	 * @return the value from the environment of the default value if no value could be obtained
	 */
	private static int getIntEnv(String name, int defaultValue) {

		if (name == null || name.isBlank()) {
			LOGGER.warn("Attempting to retrieve environment variable without a name!");
			return defaultValue;
		}

		try {
			return Integer.parseInt(System.getenv(name));
		} catch (Exception e) {
			LOGGER.warn("Failed to retrieve environment variable: {}", name, e);
		}

		return defaultValue;
	}

	/**
	 * Get the JWT expiration time (in milliseconds).
	 *
	 * @return the JWT expiration time.
	 */

	public static long jwtExpirationTime() {
		return TEN_MINUTES_IN_MILLISECONDS;
	}

	/**
	 * Get Postgrest JWT secret.
	 *
	 * @return the Postgrest JWT secret.
	 */
	public static String jwtSigningSecret() {
		return getMandatoryEnv("PGRST_JWT_SECRET");
	}

	/**
	 * Get base URL to connect to the backend.
	 *
	 * @return the Get base URL to connect to the backend.
	 */
	public static String backendBaseUrl() {
		return getMandatoryEnv("POSTGREST_URL");
	}

	/**
	 * The maximum requests rate for GitHub.
	 *
	 * @return the maximum request rate (default 6).
	 */
	public static int maxRequestsGithub() {
		return getIntEnv("MAX_REQUESTS_GITHUB", 6);
	}

	/**
	 * The maximum requests rate for GitLab.
	 *
	 * @return the maximum request rate (default 6).
	 */
	public static int maxRequestsGitLab() {
		return getIntEnv("MAX_REQUESTS_GITLAB", 6);
	}

	/**
	 * Get the maximum number of mentions to scrape in one run of the MentionScraper.
	 *
	 * @return the maximum number of mentions to scrape (default 6).
	 */
	public static int maxRequestsDoi() {
		return getIntEnv("MAX_REQUESTS_DOI", 6);
	}

	public static int maxRequestsRor() {
		return getIntEnv("MAX_REQUESTS_ROR", 6);
	}

	/**
	 * Get the maximum number of citation sources to scrape in one run of the CitationScraper.
	 *
	 * @return the maximum number of citation sources to scrape (default 5).
	 */
	public static int maxCitationSourcesToScrape() {
		return getIntEnv("MAX_REQUESTS_OPENALEX", 5);
	}

	/**
	 * Get the email contact address for crossref.
	 *
	 * @return the Get the email contact address for crossref (default unset).
	 */
	public static Optional<String> crossrefContactEmail() {
		return getOptionalEnv("CROSSREF_CONTACT_EMAIL");
	}

	/**
	 * Get the API credentials for GitHub.
	 *
	 * @return the API credentials for GitHub (default unset).
	 */
	public static Optional<String> apiCredentialsGithub() {
		return getOptionalEnv("API_CREDENTIALS_GITHUB");
	}

	/**
	 * Get the IO key for libraries.io.
	 *
	 * @return the IO key for libraries.io (default unset).
	 */
	public static Optional<String> librariesIoKey() {
		return getOptionalEnv("LIBRARIES_IO_ACCESS_TOKEN");
	}

	public static boolean isNassaScraperEnabled() {
		return "true".equals(System.getenv("ENABLE_NASSA_SCRAPER"));
	}
}
