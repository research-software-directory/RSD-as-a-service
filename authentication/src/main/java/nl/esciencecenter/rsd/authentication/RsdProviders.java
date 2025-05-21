// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * This class exposes all active OpenID providers that users can sign in with.
 * It does so by reading the relevant env variables and by requesting the 'authorization' URLs from the respective well-known URLs.
 * <br>
 * <br>
 * The main function through which the data can be obtained is {@link #activeProvidersAsJson() activeProvidersAsJson}
 * <br>
 * <br>
 * The data is obtained <strong>asynchronously</strong> in the background, meaning that subsequent calls to {@link #activeProvidersAsJson() activeProvidersAsJson} might return different data.
 */
public class RsdProviders {

	private static final Logger LOGGER = LoggerFactory.getLogger(RsdProviders.class);

	private final Map<OpenidProvider, URI> signInUrls = Collections.synchronizedMap(new EnumMap<>(OpenidProvider.class));
	private final ConcurrentMap<OpenidProvider, OpenidProviderAccessMethod> accessMethodMap = new ConcurrentHashMap<>();
	private final JsonArray activeProvidersAsJson = new JsonArray();
	private final ReadWriteLock jsonProvidersLock = new ReentrantReadWriteLock(false);

	public RsdProviders() {
		Map<OpenidProvider, RsdProviderData> authData = new EnumMap<>(OpenidProvider.class);
		Map<OpenidProvider, OpenidProviderAccessMethod> rawAccessMethodMap = RsdProviders.parseAuthProvidersEnvString(System.getenv("RSD_AUTH_PROVIDERS"));
		logRawAccessMap(rawAccessMethodMap);

		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			OpenidProviderAccessMethod accessMethod = rawAccessMethodMap.get(openidProvider);

			String displayName = obtainDisplayName(openidProvider);
			String htmlDescription = obtainHtmlDescription(openidProvider);
			URI wellKnownUrl = null;
			try {
				wellKnownUrl = Config.wellKnownUrl(openidProvider);
				if (accessMethod.isActive() && openidProvider != OpenidProvider.local && wellKnownUrl == null) {
					accessMethod = OpenidProviderAccessMethod.MISCONFIGURED;
					accessMethodMap.put(openidProvider, accessMethod);
					LOGGER.warn("Provider {} is misconfigured because no well-known URL was found", openidProvider);
				}
			} catch (URISyntaxException ignored) {
				if (accessMethod.isActive()) {
					accessMethod = OpenidProviderAccessMethod.MISCONFIGURED;
					accessMethodMap.put(openidProvider, accessMethod);
					LOGGER.warn("Provider {} is misconfigured because it has an invalid well-known URL", openidProvider);
				}
			}

			authData.put(openidProvider, new RsdProviderData(openidProvider, accessMethod, wellKnownUrl, displayName, htmlDescription));
		}

		ExecutorService threadPool = Executors.newCachedThreadPool();
		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			RsdProviderData rsdProviderData = authData.get(openidProvider);
			if (!rsdProviderData.accessType().isActive()) {
				continue;
			}

			threadPool.submit(() -> {
				try {
					URI signInUrl = obtainSignInUrl(openidProvider, rsdProviderData.wellKnownUrl());
					signInUrls.put(openidProvider, signInUrl);
					accessMethodMap.put(openidProvider, rsdProviderData.accessType());

					RsdProviderData data = authData.get(openidProvider);
					JsonObject jsonObject = new JsonObject();

					jsonObject.addProperty("openidProvider", openidProvider.toString());
					jsonObject.addProperty("accessType", data.accessType().toString());
					jsonObject.addProperty("name", data.displayName());
					jsonObject.addProperty("html", data.htmlDescription());
					jsonObject.addProperty("signInUrl", signInUrl.toString());

					Lock writeLock = jsonProvidersLock.writeLock();
					writeLock.lock();
					try {
						activeProvidersAsJson.add(jsonObject);
					} finally {
						writeLock.unlock();
					}
				} catch (IOException e) {
					LOGGER.warn("IOException when getting sign in URL for provider {}", openidProvider, e);
				} catch (RsdResponseException e) {
					LOGGER.warn("RsdResponseException when getting sign in URL for provider {}", openidProvider, e);
				} catch (InterruptedException e) {
					LOGGER.warn("InterruptedException when getting sign in URL for provider {}", openidProvider, e);
					Thread.currentThread().interrupt();
				}
			});
		}

		threadPool.shutdown();
	}

	private static void logRawAccessMap(Map<OpenidProvider, OpenidProviderAccessMethod> rawAccessMethodMap) {
		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			switch (rawAccessMethodMap.getOrDefault(openidProvider, OpenidProviderAccessMethod.DISABLED)) {
				case MISCONFIGURED ->
					LOGGER.warn("Provider {} is misconfigured", openidProvider.toUserFriendlyString());
				case DISABLED -> LOGGER.info("Provider {} is disabled", openidProvider.toUserFriendlyString());
				case INVITE_ONLY ->
					LOGGER.info("Provider {} is enabled with invites only", openidProvider.toUserFriendlyString());
				case EVERYONE -> {
					if (openidProvider == OpenidProvider.local) {
						LOGGER.warn("********************");
						LOGGER.warn("Warning: local accounts are enabled, this is not safe for production!");
						LOGGER.warn("********************");
					} else {
						LOGGER.info("Provider {} is enabled for everyone", openidProvider.toUserFriendlyString());
					}
				}
			}
		}
	}

	/**
	 * @param authConf A string containing a config for {@link OpenidProvider OpenID} providers, as described in <code>.env.example</code>
	 *                 for the <code>RSD_AUTH_PROVIDERS</code> variable.
	 * @return A map, that provides for each provider in <code>authConf</code> the parsed {@link OpenidProviderAccessMethod}.
	 * Missing entries are considered to be <code>DISABLED</code>;
	 * entries appearing multiple times are considered to be <code>MISCONFIGURED</code>.
	 */
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

			// duplicate entries are considered to be misconfigured
			result.compute(openidProvider, (_key, oldValue) -> oldValue == null ? accessMethod : OpenidProviderAccessMethod.MISCONFIGURED);
		}

		return result;
	}

	/**
	 * @param provider The provider to get the access method of.
	 * @return The access method of the OpenID provider, incorporating both the env variable
	 * <code>RSD_AUTH_PROVIDERS</code>, the respective well-known URL env variable and
	 * the result of trying to obtain the <code>authorize</code> endpoint from the
	 * well-known URL.
	 * <br>
	 * <br>
	 * Calling this multiple times with the same parameter might yield different results,
	 * as the data from the well-known URL is fetched in the background.
	 */
	public OpenidProviderAccessMethod accessMethodOfProvider(OpenidProvider provider) {
		return accessMethodMap.getOrDefault(provider, OpenidProviderAccessMethod.DISABLED);
	}

	/**
	 * @return A string representing a JSON array, containing the active OpenID providers.
	 * <br>
	 * <br>
	 * Calling this multiple times might yield different results,
	 * as the data from the well-known URL is fetched in the background.
	 */
	public String activeProvidersAsJson() {
		Lock readLock = jsonProvidersLock.readLock();
		readLock.lock();
		try {
			return activeProvidersAsJson.toString();
		} finally {
			readLock.unlock();
		}
	}

	private static String obtainDisplayName(OpenidProvider provider) {
		return switch (provider) {
			case local -> "local account";
			case surfconext -> "SURFconext";
			case helmholtz -> "Helmholtz ID";
			case orcid -> "ORCID";
			case azure -> Utils.coalesce(System.getenv("AZURE_DISPLAY_NAME"), "Azure Active Directory");
			case linkedin -> "LinkedIn";
		};
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

	private static URI obtainSignInUrl(OpenidProvider provider, URI wellKnownUrl) throws IOException, InterruptedException, RsdResponseException {
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
		String queryParameters = switch (openidProvider) {
			case local -> "";
			case surfconext -> {
				QueryParameterBuilder queryParameterBuilder = new QueryParameterBuilder()
					.addQueryParameter("response_mode", "form_post")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid")
					.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.addQueryParameter("claims", "{\"id_token\":{\"schac_home_organization\":null,\"name\":null,\"email\":null}}");

				if (Config.isDevEnv()) {
					queryParameterBuilder.addQueryParameter("prompt", "login");
				}

				yield queryParameterBuilder.toString();
			}
			case helmholtz -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid profile email eduperson_principal_name")
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
				.addQueryParameter("prompt", "select_account")
				.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
			case linkedin -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid profile email")
				.addQueryParameter("redirect_uri", obtainRedirectUrl(openidProvider))
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
		};

		String urlAsString = authUrl.toString();
		return URI.create(urlAsString + queryParameters);
	}
}
