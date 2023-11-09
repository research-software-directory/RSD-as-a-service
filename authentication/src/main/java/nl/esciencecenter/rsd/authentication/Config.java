// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

public class Config {

	private static final Collection<String> rsdAdmins;

	static {
		String adminList = System.getenv("RSD_ADMIN_EMAIL_LIST");
		rsdAdmins = adminList == null || adminList.isBlank() ? Collections.emptySet() :
				Set.of(adminList.split(";"));
	}

	public static String jwtSigningSecret() {
		return System.getenv("PGRST_JWT_SECRET");
	}

	private static Collection<String> rsdAuthProviders() {
		return Optional.ofNullable(System.getenv("RSD_AUTH_PROVIDERS"))
				.map(String::toUpperCase)
				.map(s -> s.split(";"))
				.map(Set::of)
				.orElse(Collections.emptySet());
	}

	public static Collection<String> rsdAdmins() {
		return rsdAdmins;
	}

	public static boolean isLocalEnabled() {
		return rsdAuthProviders().contains("LOCAL");
	}

	public static boolean isSurfConextEnabled() {
		Collection<String> enabledProviders = rsdAuthProviders();
		return enabledProviders.isEmpty() || enabledProviders.contains("SURFCONEXT");
	}

	public static boolean isHelmholtzEnabled() {
		return rsdAuthProviders().contains("HELMHOLTZAAI");
	}

	public static boolean isOrcidEnabled() {
		return rsdAuthProviders().contains("ORCID");
	}

	public static boolean isAzureEnabled() {
		return rsdAuthProviders().contains("AZURE");
	}

	public static String userMailWhitelist() {
		return System.getenv("RSD_AUTH_USER_MAIL_WHITELIST");
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

	public static String surfconextScopes() {
		return System.getenv("SURFCONEXT_SCOPES");
	}


	//	Helmholtz AAI
	public static String helmholtzAaiRedirect() {
		return System.getenv("HELMHOLTZAAI_REDIRECT");
	}

	public static String helmholtzAaiClientId() {
		return System.getenv("HELMHOLTZAAI_CLIENT_ID");
	}

	public static String helmholtzAaiWellknown() {
		return System.getenv("HELMHOLTZAAI_WELL_KNOWN_URL");
	}

	public static String helmholtzAaiClientSecret() {
		return System.getenv("AUTH_HELMHOLTZAAI_CLIENT_SECRET");
	}

	public static String helmholtzAaiScopes() {
		return System.getenv("HELMHOLTZAAI_SCOPES");
	}

	public static boolean helmholtzAaiAllowExternalUsers() {
		return Boolean.parseBoolean(
				System.getenv("HELMHOLTZAAI_ALLOW_EXTERNAL_USERS")
		);
	}

	public static String helmholtzAaiAllowList() {
		return System.getenv("HELMHOLTZAAI_ALLOW_LIST");
	}

	public static boolean helmholtzAaiUseAllowList() {
		return Boolean.parseBoolean(
				System.getenv("HELMHOLTZAAI_USE_ALLOW_LIST")
		);
	}


	// ORCID
	public static String orcidRedirect() {
		return System.getenv("ORCID_REDIRECT");
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

	public static String orcidScopes() {
		return System.getenv("ORCID_SCOPES");
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

	public static String azureScopes() {
		return System.getenv("AZURE_SCOPES");
	}

	public static String azureOrganisation() {
		return System.getenv("AZURE_ORGANISATION");
	}
}
