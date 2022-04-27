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

	public static String surfconextWellknown() {
		return System.getenv("NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL");
	}

	public static String surfconextClientSecret() {
		return System.getenv("AUTH_SURFCONEXT_CLIENT_SECRET");
	}

	public static String surfconextTokenUrl() {
		return System.getenv("AUTH_SURFCONEXT_TOKEN_URL");
	}

	public static String surconextScopes() {
		return System.getenv("NEXT_PUBLIC_SURFCONEXT_SCOPES");
	}

	public static String helmholtzAaiRedirect() {
		return System.getenv("NEXT_PUBLIC_HELMHOLTZAAI_REDIRECT");
	}

	public static String helmholtzAaiClientId() {
		return System.getenv("NEXT_PUBLIC_HELMHOLTZAAI_CLIENT_ID");
	}

	public static String helmholtzAaiWellknown() {
		return System.getenv("NEXT_PUBLIC_HELMHOLTZAAI_WELL_KNOWN_URL");
	}

	public static String helmholtzAaiClientSecret() {
		return System.getenv("AUTH_HELMHOLTZAAI_CLIENT_SECRET");
	}

	public static String helmholtzAaiTokenUrl() {
		return System.getenv("AUTH_HELMHOLTZAAI_TOKEN_URL");
	}

	public static String helmholtzAaiScopes() {
		return System.getenv("NEXT_PUBLIC_HELMHOLTZAAI_SCOPES");
	}

	public static boolean helmholtzAaiAllowExternalUsers() {
		return Boolean.parseBoolean(
			System.getenv("HELMHOLTZAAI_ALLOW_EXTERNAL_USERS")
		);
	}
}
