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
	 * TODO: The request rate may vary per platform.
	 * @return Maximum request rate (default 6).
	 */
	public static int maxRequestsGitLab() {
		String valueAsString = System.getenv("MAX_REQUESTS_GITLAB");
		return valueAsString == null ? 6 : Integer.parseInt(valueAsString);
	}
}
