// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.Map;
import java.util.SequencedCollection;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

	private static final OpenidProviderAccessMethodOrder DEFAULT_ACCESS_METHOD_ORDER =
		new OpenidProviderAccessMethodOrder(OpenidProviderAccessMethod.DISABLED, Integer.MAX_VALUE);

	private final ConcurrentMap<OpenidProvider, OpenidProviderAccessMethod> accessMethodOrderMap =
		new ConcurrentHashMap<>();

	private String activeProvidersString = "[]";

	private final ReadWriteLock jsonProvidersLock = new ReentrantReadWriteLock(false);

	public RsdProviders() {
		Map<OpenidProvider, OpenidProviderAccessMethodOrder> rawAccessMethodMap =
			RsdProviders.parseAuthProvidersEnvString(System.getenv("RSD_AUTH_PROVIDERS"));
		logRawAccessMap(rawAccessMethodMap);
		SequencedCollection<RsdProviderData> activeProvidersSorted = new TreeSet<>(
			Comparator.comparingInt(RsdProviderData::order)
		);

		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			OpenidProviderAccessMethodOrder rawAccessMethodOrder = rawAccessMethodMap.getOrDefault(
				openidProvider,
				DEFAULT_ACCESS_METHOD_ORDER
			);
			OpenidProviderAccessMethod rawAccessMethod = rawAccessMethodOrder.accessMethod();
			if (!rawAccessMethod.isActive()) {
				continue;
			}

			String displayName = obtainDisplayName(openidProvider);
			String htmlDescription = obtainHtmlDescription(openidProvider);
			URI wellKnownUrl;
			try {
				wellKnownUrl = Config.wellKnownUrl(openidProvider);
				if (openidProvider != OpenidProvider.local && wellKnownUrl == null) {
					accessMethodOrderMap.put(openidProvider, OpenidProviderAccessMethod.MISCONFIGURED);
					LOGGER.warn("Provider {} is misconfigured because no well-known URL was found", openidProvider);
					continue;
				}
			} catch (URISyntaxException ignored) {
				accessMethodOrderMap.put(openidProvider, OpenidProviderAccessMethod.MISCONFIGURED);
				LOGGER.warn("Provider {} is misconfigured because it has an invalid well-known URL", openidProvider);
				continue;
			}

			activeProvidersSorted.add(
				new RsdProviderData(
					openidProvider,
					rawAccessMethod,
					wellKnownUrl,
					displayName,
					htmlDescription,
					rawAccessMethodOrder.order()
				)
			);
		}

		Map<OpenidProvider, URI> signInUrls = new EnumMap<>(OpenidProvider.class);
		Map<OpenidProvider, URI> coupleUrls = new EnumMap<>(OpenidProvider.class);

		ExecutorService threadPool = Executors.newFixedThreadPool(10);
		try {
			for (RsdProviderData rsdProviderData : activeProvidersSorted) {
				threadPool.submit(() -> {
					OpenidProvider openidProvider = rsdProviderData.openidProvider();
					try {
						AuthUrls authUrls = obtainSignInUrl(openidProvider, rsdProviderData.wellKnownUrl());
						URI signInUrl = authUrls.signInUrl();
						URI coupleUrl = authUrls.coupleUrl();

						Lock writeLock = jsonProvidersLock.writeLock();
						writeLock.lock();
						try {
							accessMethodOrderMap.put(openidProvider, rsdProviderData.accessType());
							signInUrls.put(openidProvider, signInUrl);
							coupleUrls.put(openidProvider, coupleUrl);

							this.activeProvidersString = activeProvidersSorted
								.stream()
								.filter(p -> signInUrls.containsKey(p.openidProvider()))
								.map(p ->
									toJson(p, signInUrls.get(p.openidProvider()), coupleUrls.get(p.openidProvider()))
								)
								.collect(JsonArray::new, JsonArray::add, JsonArray::addAll)
								.toString();
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
					} catch (RuntimeException e) {
						LOGGER.warn("RuntimeException when getting sign in URL for provider {}", openidProvider, e);
					}
				});
			}
		} finally {
			threadPool.shutdown();
		}
	}

	private static JsonObject toJson(RsdProviderData data, URI signInUrl, URI coupleUrl) {
		JsonObject jsonObject = new JsonObject();

		jsonObject.addProperty("openidProvider", data.openidProvider().toString());
		jsonObject.addProperty("accessType", data.accessType().toString());
		jsonObject.addProperty("name", data.displayName());
		jsonObject.addProperty("html", data.htmlDescription());
		jsonObject.addProperty("signInUrl", signInUrl.toString());
		jsonObject.addProperty("coupleUrl", coupleUrl.toString());

		return jsonObject;
	}

	private static void logRawAccessMap(Map<OpenidProvider, OpenidProviderAccessMethodOrder> rawAccessMethodMap) {
		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			OpenidProviderAccessMethod accessMethod = rawAccessMethodMap
				.getOrDefault(openidProvider, DEFAULT_ACCESS_METHOD_ORDER)
				.accessMethod();

			switch (accessMethod) {
				case MISCONFIGURED -> LOGGER.warn(
					"Provider {} is misconfigured",
					openidProvider.toUserFriendlyString()
				);
				case DISABLED -> LOGGER.info("Provider {} is disabled", openidProvider.toUserFriendlyString());
				case INVITE_ONLY -> LOGGER.info(
					"Provider {} is enabled with invites only",
					openidProvider.toUserFriendlyString()
				);
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

	record OpenidProviderAccessMethodOrder(OpenidProviderAccessMethod accessMethod, int order) {}

	/**
	 * @param authConf A string containing a config for {@link OpenidProvider OpenID} providers, as described in <code>.env.example</code>
	 *                 for the <code>RSD_AUTH_PROVIDERS</code> variable.
	 * @return A map, that provides for each provider in <code>authConf</code> the parsed {@link OpenidProviderAccessMethod}
	 * and the index at which the provider was found, which can used for sorting on the input order.
	 * Missing entries are considered to be <code>DISABLED</code>;
	 * entries appearing multiple times are considered to be <code>MISCONFIGURED</code>.
	 */
	static Map<OpenidProvider, OpenidProviderAccessMethodOrder> parseAuthProvidersEnvString(String authConf) {
		Map<OpenidProvider, OpenidProviderAccessMethodOrder> result = new EnumMap<>(OpenidProvider.class);

		if (authConf == null) {
			return result;
		}
		String[] split = authConf.split(";");
		for (int i = 0; i < split.length; ++i) {
			String providerConf = split[i];
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
				result.put(
					openidProvider,
					new OpenidProviderAccessMethodOrder(OpenidProviderAccessMethod.MISCONFIGURED, i)
				);
				continue;
			}

			OpenidProviderAccessMethod accessMethod;
			try {
				accessMethod = OpenidProviderAccessMethod.valueOf(providerSplit[1]);
			} catch (IllegalArgumentException e) {
				result.put(
					openidProvider,
					new OpenidProviderAccessMethodOrder(OpenidProviderAccessMethod.MISCONFIGURED, i)
				);
				continue;
			}

			final int iCopy = i;
			// duplicate entries are considered to be misconfigured
			result.compute(openidProvider, (_key, oldValue) ->
				oldValue == null
					? new OpenidProviderAccessMethodOrder(accessMethod, iCopy)
					: new OpenidProviderAccessMethodOrder(OpenidProviderAccessMethod.MISCONFIGURED, iCopy)
			);
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
		return accessMethodOrderMap.getOrDefault(provider, OpenidProviderAccessMethod.DISABLED);
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
			return activeProvidersString;
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
			case github -> "GitHub";
		};
	}

	private static String obtainHtmlDescription(OpenidProvider provider) {
		return switch (provider) {
			case local -> "Sign in with local account is <strong>for testing purposes only</strong>. This option should not be enabled in the production version.";
			case surfconext -> "Sign in with SURFconext is for <strong>Dutch Institutions</strong> who enabled the RSD service in the SURFconext IdP dashboard.";
			case helmholtz -> "Sign in with Helmholtz ID is enabled for all members of the <strong>Helmholtz Research Foundation</strong>.";
			case orcid -> "Sign in with your ORCID account.";
			case azure -> Utils.coalesce(
				System.getenv("AZURE_DESCRIPTION_HTML"),
				"Login with your institutional credentials."
			);
			case linkedin -> "Sign in with your LinkedIn account.";
			case github -> "Sign in with your GitHub account.";
		};
	}

	private record AuthUrls(URI signInUrl, URI coupleUrl) {}

	private static AuthUrls obtainSignInUrl(OpenidProvider provider, URI wellKnownUrl)
		throws IOException, InterruptedException, RsdResponseException {
		return switch (provider) {
			case local -> new AuthUrls(URI.create("/login/local"), URI.create("/login/local/couple"));
			case surfconext, helmholtz, orcid, azure, linkedin, github -> {
				URI authUrl;
				if (provider == OpenidProvider.github) {
					// GitHub's well-known endpoint doesn't return this info,
					// so we have to hardcode it and hope it doesn't change.
					// URL obtained from https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app#accepting-user-authorization
					authUrl = URI.create("https://github.com/login/oauth/authorize");
				} else {
					authUrl = Utils.getAuthUrlFromWellKnownUrl(wellKnownUrl);
				}

				yield new AuthUrls(
					addQueryParametersToAuthUrl(authUrl, provider, false),
					addQueryParametersToAuthUrl(authUrl, provider, true)
				);
			}
		};
	}

	static String obtainLoginPath(OpenidProvider provider) {
		return switch (provider) {
			case local -> "/auth/login/local";
			case surfconext -> "/auth/login/surfconext";
			case helmholtz -> "/auth/login/helmholtzid";
			case orcid -> "/auth/login/orcid";
			case azure -> "/auth/login/azure";
			case linkedin -> "/auth/login/linkedin";
			// switched path components because GitHub only allows one redirect URL but allows sub-paths
			case github -> "/auth/github/login";
		};
	}

	static String obtainRedirectUrl(OpenidProvider provider) {
		String loginPath = obtainLoginPath(provider);
		return switch (provider) {
			case local -> throw new IllegalArgumentException();
			case surfconext -> Config.hostUrl() + loginPath;
			case helmholtz -> Config.hostUrl() + loginPath;
			case orcid -> Config.hostUrl() + loginPath;
			case azure -> Config.hostUrl() + loginPath;
			case linkedin -> Config.hostUrl() + loginPath;
			case github -> Config.hostUrl() + loginPath;
		};
	}

	static String obtainCouplingPath(OpenidProvider provider) {
		return switch (provider) {
			case local -> "/auth/couple/local";
			case surfconext -> "/auth/couple/surfconext";
			case helmholtz -> "/auth/couple/helmholtzid";
			case orcid -> "/auth/couple/orcid";
			case azure -> "/auth/couple/azure";
			case linkedin -> "/auth/couple/linkedin";
			// switched path components because GitHub only allows one redirect URL but allows sub-paths
			case github -> "/auth/github/couple";
		};
	}

	static String obtainCouplingRedirectUrl(OpenidProvider provider) {
		String couplingPath = obtainCouplingPath(provider);
		return switch (provider) {
			case local -> throw new IllegalArgumentException();
			case surfconext -> Config.hostUrl() + couplingPath;
			case helmholtz -> Config.hostUrl() + couplingPath;
			case orcid -> {
				String hostUrl = Config.hostUrl();
				// ORCID needs a dot in its redirect URL, which is why we prepend "www."
				if (hostUrl.equals("http://localhost")) {
					yield "http://www.localhost" + couplingPath;
				}
				yield hostUrl + couplingPath;
			}
			case azure -> Config.hostUrl() + couplingPath;
			case linkedin -> Config.hostUrl() + couplingPath;
			case github -> Config.hostUrl() + couplingPath;
		};
	}

	public static String obtainClientId(OpenidProvider provider) {
		return switch (provider) {
			case local -> null;
			case surfconext -> System.getenv("SURFCONEXT_CLIENT_ID");
			case helmholtz -> System.getenv("HELMHOLTZID_CLIENT_ID");
			case orcid -> System.getenv("ORCID_CLIENT_ID");
			case azure -> System.getenv("AZURE_CLIENT_ID");
			case linkedin -> System.getenv("LINKEDIN_CLIENT_ID");
			case github -> System.getenv("GITHUB_CLIENT_ID");
		};
	}

	private static URI addQueryParametersToAuthUrl(URI authUrl, OpenidProvider openidProvider, boolean isCoupleUrl) {
		String queryParameters = switch (openidProvider) {
			case local -> "";
			case surfconext -> {
				QueryParameterBuilder queryParameterBuilder = new QueryParameterBuilder()
					.addQueryParameter("response_mode", "query")
					.addQueryParameter("response_type", "code")
					.addQueryParameter("scope", "openid")
					.addQueryParameter(
						"redirect_uri",
						isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
					)
					.addQueryParameter("client_id", obtainClientId(openidProvider))
					.addQueryParameter(
						"claims",
						"{\"id_token\":{\"schac_home_organization\":null,\"name\":null,\"email\":null}}"
					);

				if (Config.isDevEnv()) {
					queryParameterBuilder.addQueryParameter("prompt", "login");
				}

				yield queryParameterBuilder.toString();
			}
			case helmholtz -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid profile email eduperson_principal_name")
				.addQueryParameter(
					"redirect_uri",
					isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
				)
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.addQueryParameter(
					"claims",
					"{\"id_token\":{\"schac_home_organization\":null,\"name\":null,\"email\":null}}"
				)
				.toString();
			case orcid -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid")
				.addQueryParameter(
					"redirect_uri",
					isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
				)
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
			case azure -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid")
				.addQueryParameter("prompt", "select_account")
				.addQueryParameter(
					"redirect_uri",
					isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
				)
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
			case linkedin -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid profile email")
				.addQueryParameter(
					"redirect_uri",
					isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
				)
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
			case github -> new QueryParameterBuilder()
				.addQueryParameter("response_mode", "query")
				.addQueryParameter("response_type", "code")
				.addQueryParameter("scope", "openid")
				.addQueryParameter(
					"redirect_uri",
					isCoupleUrl ? obtainCouplingRedirectUrl(openidProvider) : obtainRedirectUrl(openidProvider)
				)
				.addQueryParameter("client_id", obtainClientId(openidProvider))
				.toString();
		};

		String urlAsString = authUrl.toString();
		return URI.create(urlAsString + queryParameters);
	}
}
