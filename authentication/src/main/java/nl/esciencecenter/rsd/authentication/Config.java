// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.Collection;
import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

public class Config {

	public static String jwtSigningSecret() {
		return System.getenv("PGRST_JWT_SECRET");
	}

	private Config() {
	}

	private static Collection<String> rsdAuthCoupleProviders() {
		return Optional.ofNullable(System.getenv("RSD_AUTH_COUPLE_PROVIDERS"))
			.map(String::toUpperCase)
			.map(s -> s.split(";"))
			.map(Set::of)
			.orElse(Collections.emptySet());
	}

	public static boolean isDevEnv() {
		try {
			return "dev".equals(System.getenv("RSD_ENVIRONMENT"));
		} catch (RuntimeException e) {
			return false;
		}
	}

	private static final Map<OpenidProvider, OpenidProviderAccessMethod> ACCESS_METHOD_MAP = parseAuthProvidersEnvString(System.getenv("RSD_AUTH_PROVIDERS"));

	static Map<OpenidProvider, OpenidProviderAccessMethod> parseAuthProvidersEnvString(String authConf) {
		Map<OpenidProvider, OpenidProviderAccessMethod> result = new EnumMap<>(OpenidProvider.class);

		if (authConf == null) {
			return result;
		}
		String[] split = authConf.split(";");
		for (String providerConf : split) {
			String[] providerSplit = providerConf.split(":");
			if (providerSplit.length == 0) {
				continue;
			}
			OpenidProvider openidProvider;
			try {
				openidProvider = OpenidProvider.valueOf(providerSplit[0].toLowerCase());
			} catch (IllegalArgumentException e) {
				continue;
			}

			if (providerSplit.length != 2) {
				result.put(openidProvider, OpenidProviderAccessMethod.MISCONFIGURED);
				continue;
			}

			OpenidProviderAccessMethod accessMethod;
			try {
				accessMethod = OpenidProviderAccessMethod.valueOf(providerSplit[1]);
			} catch (IllegalArgumentException e) {
				result.put(openidProvider, OpenidProviderAccessMethod.MISCONFIGURED);
				continue;
			}

			result.compute(openidProvider, (_key, oldValue) -> oldValue == null ? accessMethod : OpenidProviderAccessMethod.MISCONFIGURED);
		}

		return result;
	}

	public static OpenidProviderAccessMethod accessMethodOfProvider(OpenidProvider provider) {
		Objects.requireNonNull(provider);
		return ACCESS_METHOD_MAP.getOrDefault(provider, OpenidProviderAccessMethod.DISABLED);
	}

	public static boolean isOrcidCouplingEnabled() {
		return rsdAuthCoupleProviders().contains("ORCID");
	}

	public static boolean isLinkedinCouplingEnabled() {
		return rsdAuthCoupleProviders().contains("LINKEDIN");
	}

	public static String backendBaseUrl() {
		return System.getenv("POSTGREST_URL");
	}


	// SURFconext
	public static String surfconextRedirect() {
		return System.getenv("SURFCONEXT_REDIRECT");
	}

	public static String surfconextClientId() {
		return System.getenv("SURFCONEXT_CLIENT_ID");
	}

	public static String surfconextWellknown() {
		return System.getenv("SURFCONEXT_WELL_KNOWN_URL");
	}

	public static String surfconextClientSecret() {
		return System.getenv("AUTH_SURFCONEXT_CLIENT_SECRET");
	}


	//	Helmholtz ID
	public static String helmholtzIdRedirect() {
		return System.getenv("HELMHOLTZID_REDIRECT");
	}

	public static String helmholtzIdClientId() {
		return System.getenv("HELMHOLTZID_CLIENT_ID");
	}

	public static String helmholtzIdWellknown() {
		return System.getenv("HELMHOLTZID_WELL_KNOWN_URL");
	}

	public static String helmholtzIdClientSecret() {
		return System.getenv("AUTH_HELMHOLTZID_CLIENT_SECRET");
	}

	public static String helmholtzIdScopes() {
		return System.getenv("HELMHOLTZID_SCOPES");
	}

	public static boolean helmholtzIdAllowExternalUsers() {
		return Boolean.parseBoolean(
			System.getenv("HELMHOLTZID_ALLOW_EXTERNAL_USERS")
		);
	}

	// ORCID
	public static String orcidRedirect() {
		return System.getenv("ORCID_REDIRECT");
	}

	public static String orcidRedirectCouple() {
		return System.getenv("ORCID_REDIRECT_COUPLE");
	}

	public static String orcidClientId() {
		return System.getenv("ORCID_CLIENT_ID");
	}

	public static String orcidWellknown() {
		return System.getenv("ORCID_WELL_KNOWN_URL");
	}

	public static String orcidClientSecret() {
		return System.getenv("AUTH_ORCID_CLIENT_SECRET");
	}


	// Azure Active Directory
	public static String azureRedirect() {
		return System.getenv("AZURE_REDIRECT");
	}

	public static String azureClientId() {
		return System.getenv("AZURE_CLIENT_ID");
	}

	public static String azureWellknown() {
		return System.getenv("AZURE_WELL_KNOWN_URL");
	}

	public static String azureClientSecret() {
		return System.getenv("AUTH_AZURE_CLIENT_SECRET");
	}

	public static String azureOrganisation() {
		return System.getenv("AZURE_ORGANISATION");
	}


	// LinkedIn
	public static String linkedinRedirect() {
		return System.getenv("LINKEDIN_REDIRECT");
	}

	public static String linkedinRedirectCouple() {
		return System.getenv("LINKEDIN_REDIRECT_COUPLE");
	}

	public static String linkedinClientId() {
		return System.getenv("LINKEDIN_CLIENT_ID");
	}

	public static String linkedinWellknown() {
		return System.getenv("LINKEDIN_WELL_KNOWN_URL");
	}

	public static String linkedinClientSecret() {
		return System.getenv("AUTH_LINKEDIN_CLIENT_SECRET");
	}
}
