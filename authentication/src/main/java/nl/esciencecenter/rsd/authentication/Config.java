// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

public class Config {

	private static final long TEN_MINUTES_IN_MILLISECONDS = 600_000L; // 10 * 60 * 1000

	public static String jwtSigningSecret() {
		return System.getenv("PGRST_JWT_SECRET");
	}

	public static long jwtExpirationTime() {
		return TEN_MINUTES_IN_MILLISECONDS;
	}

	private static Collection<String> rsdAuthProviders() {
		return Optional.ofNullable(System.getenv("RSD_AUTH_PROVIDERS"))
				.map(s -> s.toUpperCase())
				.map(s -> s.split(";"))
				.map(strings -> Set.of(strings))
				.orElse(Collections.EMPTY_SET);
	}

	public static boolean isLocalEnabled() {
		return rsdAuthProviders().contains("LOCAL");
	}

	public static boolean isSurfConextEnabled() {
		Collection<String> enabledProviders =  rsdAuthProviders();
		return enabledProviders.isEmpty() || enabledProviders.contains("SURFCONEXT");
	}

	public static boolean isHelmholtzEnabled() {
		return rsdAuthProviders().contains("HELMHOLTZAAI");
	}

	public static String userMailWhitelist() {
		return System.getenv("RSD_AUTH_USER_MAIL_WHITELIST");
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
