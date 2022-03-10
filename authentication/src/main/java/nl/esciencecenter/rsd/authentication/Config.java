package nl.esciencecenter.rsd.authentication;

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

	public static String surfconextRedirect() {
		return System.getenv("NEXT_PUBLIC_SURFCONEXT_REDIRECT");
	}

	public static String surfconextClientId() {
		return System.getenv("NEXT_PUBLIC_SURFCONEXT_CLIENT_ID");
	}

	public static String surfconextClientSecret() {
		return System.getenv("AUTH_SURFCONEXT_CLIENT_SECRET");
	}
}
