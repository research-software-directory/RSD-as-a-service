// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.net.URI;
import java.net.URISyntaxException;

public class Config {

	private Config() {
	}

	public static String hostUrl() {
		return System.getenv("HOST_URL");
	}

	public static String jwtSigningSecret() {
		return System.getenv("PGRST_JWT_SECRET");
	}

	public static boolean isDevEnv() {
		try {
			return "dev".equals(System.getenv("RSD_ENVIRONMENT"));
		} catch (RuntimeException e) {
			return false;
		}
	}

	public static URI wellKnownUrl(OpenidProvider provider) throws URISyntaxException {
		String rawUrl = switch (provider) {
			case local -> null;
			case surfconext -> surfconextWellknown();
			case helmholtz -> helmholtzIdWellknown();
			case orcid -> orcidWellknown();
			case azure -> azureWellknown();
			case linkedin -> linkedinWellknown();
		};

		if (rawUrl == null) {
			return null;
		}

		return new URI(rawUrl);
	}

	public static boolean isApiAccessTokenEnabled() {
		return "true".equals(System.getenv("RSD_API_ACCESS_TOKEN_ENABLED"));
	}

	public static String backendBaseUrl() {
		return System.getenv("POSTGREST_URL");
	}


	// SURFconext
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
