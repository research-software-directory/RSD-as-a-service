// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;

public class RsdProviders {

	private static final Logger LOGGER = LoggerFactory.getLogger(RsdProviders.class);
	private final Map<OpenidProvider, RsdProviderData> authData = new EnumMap<>(OpenidProvider.class);

	public RsdProviders() {
		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			// TODO replace with uninterpreted ACCESS_METHOD_MAP
			OpenidProviderAccessMethod accessMethod = Config.accessMethodOfProvider(openidProvider);

			String displayName = obtainDisplayName(openidProvider);
			String htmlDescription = obtainHtmlDescription(openidProvider);
			URI wellKnownUrl = null;
			try {
				wellKnownUrl = Config.wellKnownUrl(openidProvider);
				if (openidProvider != OpenidProvider.local && wellKnownUrl == null) {
					accessMethod = OpenidProviderAccessMethod.MISCONFIGURED;
					LOGGER.warn("Provider {} is misconfigured because no well-known URL was found", openidProvider);
				}
			} catch (URISyntaxException ignored) {
				if (accessMethod == OpenidProviderAccessMethod.EVERYONE || accessMethod == OpenidProviderAccessMethod.INVITE_ONLY) {
					accessMethod = OpenidProviderAccessMethod.MISCONFIGURED;
					LOGGER.warn("Provider {} is misconfigured because it has an invalid well-known URL", openidProvider);
				}
			}

			authData.put(openidProvider, new RsdProviderData(openidProvider, accessMethod, wellKnownUrl, displayName, htmlDescription));
		}
	}

	public OpenidProviderAccessMethod accessMethodOfProvider(OpenidProvider provider) {
		Objects.requireNonNull(provider);
		return authData.get(provider).accessMethod();
	}

	private static String obtainDisplayName(OpenidProvider provider) {
		String name = switch (provider) {
			case local -> "local account";
			case surfconext -> "SURFconext";
			case helmholtz -> "Helmholtz ID";
			case orcid -> "ORCID";
			case azure -> System.getenv("AZURE_DISPLAY_NAME");
			case linkedin -> "LinkedIn";
		};

		return name == null ? provider.toUserFriendlyString() : name;
	}

	private static String obtainHtmlDescription(OpenidProvider provider) {
		return switch (provider) {
			case local ->
					"Sign in with local account is <strong>for testing purposes only</strong>. This option should not be enabled in the production version.";
			case surfconext ->
					"Sign in with SURFconext is for <strong>Dutch Institutions</strong> who enabled the RSD service in the SURFconext IdP dashboard.";
			case helmholtz ->
					"Sign in with Helmholtz ID is enabled for all members of the <strong>Helmholtz Research Foundation</strong>.";
			case orcid -> "Sign in with your ORCID account.";
			case azure ->
					Utils.coalesce(System.getenv("AZURE_DESCRIPTION_HTML"), "Login with your institutional credentials.");
			case linkedin -> "Sign in with your LinkedIn account.";
		};
	}

	private static URI obtainSignInUrl(OpenidProvider provider, URI wellKnownUrl) throws IOException, InterruptedException {
		return switch (provider) {
			case local -> URI.create("/login/local");
			case surfconext, helmholtz, orcid, azure, linkedin -> {
				URI authUrl = Utils.getAuthUrlFromWellKnownUrl(wellKnownUrl);
				yield addQueryParametersToAuthUrl(authUrl, provider);
			}
		};
	}

	private static String obtainRedirectUrl(OpenidProvider provider) {
		return switch (provider) {
			case local -> null;
			case surfconext -> System.getenv("SURFCONEXT_REDIRECT");
			case helmholtz -> System.getenv("HELMHOLTZID_REDIRECT");
			case orcid -> System.getenv("ORCID_REDIRECT");
			case azure -> System.getenv("AZURE_REDIRECT");
			case linkedin -> System.getenv("LINKEDIN_REDIRECT");
		};
	}

	private static String obtainClientId(OpenidProvider provider) {
		return switch (provider) {
			case local -> null;
			case surfconext -> System.getenv("SURFCONEXT_CLIENT_ID");
			case helmholtz -> System.getenv("HELMHOLTZID_CLIENT_ID");
			case orcid -> System.getenv("ORCID_CLIENT_ID");
			case azure -> System.getenv("AZURE_CLIENT_ID");
			case linkedin -> System.getenv("LINKEDIN_CLIENT_ID");
		};
	}

	private static URI addQueryParametersToAuthUrl(URI authUrl, OpenidProvider openidProvider) {
		String urlAsString = authUrl.toString();
		String queryParameters = switch (openidProvider) {
			case local -> "";
			case surfconext -> new QueryParameterBuilder()
					.addQueryParameter("response_mode", "form_post")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.addQueryParameter("claims", "{\"id_token\":{\"schac_home_organization\":null,\"name\":null,\"email\":null}}")
					.toString();
			case helmholtz -> new QueryParameterBuilder()
					.addQueryParameter("response_mode", "query")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid+profile+email+eduperson_principal_name")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.addQueryParameter("claims", "{\"id_token\":{\"schac_home_organization\":null,\"name\":null,\"email\":null}}")
					.toString();
			case orcid -> new QueryParameterBuilder()
					.addQueryParameter("response_mode", "query")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.toString();
			case azure -> new QueryParameterBuilder()
					.addQueryParameter("response_mode", "query")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.toString();
			case linkedin -> new QueryParameterBuilder()
					.addQueryParameter("response_mode", "query")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid+profile+email")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.toString();
		};
		return URI.create(urlAsString + queryParameters);
	}
}
