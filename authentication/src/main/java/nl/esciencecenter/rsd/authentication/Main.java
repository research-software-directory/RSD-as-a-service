// SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import nl.esciencecenter.rsd.authentication.RsdAccessTokenException.UnverifiedAccessTokenException;

public class Main {
	private static final Duration AUTH_COOKIE_DURATION = Duration.ofHours(1);
	private static final Duration FAILURE_COOKIE_DURATION = Duration.ofMinutes(1);
	private static final String INVITE_COOKIE_NAME = "rsd_invite_id";

	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
	private static final String LOGIN_FAILED_PATH = "/login/failed";
	private static final HttpClient httpClient = HttpClient.newHttpClient();

	public static boolean idUserIsHelmholtzMember(OpenIdInfo helmholtzInfo) {
		if (helmholtzInfo.organisation() == null) {
			return false;
		} else {
			return true;
		}
	}

	public static void main(String[] args) {
		RsdProviders rsdProviders = new RsdProviders();
		Javalin app = Javalin.create(c -> c.useVirtualThreads = false).start(7000);

		app.afterMatched("/auth/login/*", ctx -> {
			ctx.removeCookie(INVITE_COOKIE_NAME, "/auth");
		});

		app.get("/auth/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		app.get("/auth/providers", ctx -> {
			ctx.json(rsdProviders.activeProvidersAsJson());
		});

		app.post("/auth/login/local", ctx -> {
			OpenidProvider localProvider = OpenidProvider.local;
			switch (rsdProviders.accessMethodOfProvider(localProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, localProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, localProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo localInfo = extractLocalInfo(ctx);

					handleAccountInviteOnly(localInfo, localProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo localInfo = extractLocalInfo(ctx);

					handleAccountEveryoneAllowed(localInfo, localProvider, ctx);
				}
			}
		});

		app.post("/auth/login/surfconext", ctx -> {
			OpenidProvider surfProvider = OpenidProvider.surfconext;
			switch (rsdProviders.accessMethodOfProvider(surfProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, surfProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, surfProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo surfconextInfo = extractSurfInfo(ctx);

					handleAccountInviteOnly(surfconextInfo, surfProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo surfconextInfo = extractSurfInfo(ctx);

					handleAccountEveryoneAllowed(surfconextInfo, surfProvider, ctx);
				}
			}
		});

		app.get("/auth/login/helmholtzid", ctx -> {
			OpenidProvider helmholtzProvider = OpenidProvider.helmholtz;
			switch (rsdProviders.accessMethodOfProvider(helmholtzProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, helmholtzProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, helmholtzProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo helmholtzInfo = extractHelmholtzInfo(ctx);

					handleAccountInviteOnly(helmholtzInfo, helmholtzProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo helmholtzInfo = extractHelmholtzInfo(ctx);

					if (!idUserIsHelmholtzMember(helmholtzInfo) && !Config.helmholtzIdAllowExternalUsers()) {
						// If no external members can login by default, access can be granted via invites
						handleAccountInviteOnly(helmholtzInfo, helmholtzProvider, ctx);
					} else {
						handleAccountEveryoneAllowed(helmholtzInfo, helmholtzProvider, ctx);
					}
				}
			}
		});

		app.get("/auth/login/orcid", ctx -> {
			OpenidProvider orcidProvider = OpenidProvider.orcid;
			switch (rsdProviders.accessMethodOfProvider(orcidProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, orcidProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, orcidProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo orcidInfo = extractOrcidInfo(ctx);

					handleAccountInviteOnly(orcidInfo, orcidProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo orcidInfo = extractOrcidInfo(ctx);

					handleAccountEveryoneAllowed(orcidInfo, orcidProvider, ctx);
				}
			}
		});

		if (Config.isOrcidCouplingEnabled()) {
			app.get("/auth/couple/orcid", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.orcidRedirectCouple();
				OpenIdInfo orcidInfo = new OrcidLogin(code, redirectUrl).openidInfo();

				String tokenToVerify = ctx.cookie("rsd_token");
				String signingSecret = Config.jwtSigningSecret();
				JwtVerifier verifier = new JwtVerifier(signingSecret);
				DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
				UUID accountId = UUID.fromString(decodedJWT.getClaim("account").asString());

				new PostgrestAccount(Config.backendBaseUrl()).coupleLogin(accountId, orcidInfo, OpenidProvider.orcid);

				setRedirectFromCookie(ctx);
			});
		}

		app.get("/auth/login/azure", ctx -> {
			OpenidProvider azureProvider = OpenidProvider.azure;
			switch (rsdProviders.accessMethodOfProvider(azureProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, azureProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, azureProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo azureInfo = extractAzureInfo(ctx);

					handleAccountInviteOnly(azureInfo, azureProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo azureInfo = extractAzureInfo(ctx);

					handleAccountEveryoneAllowed(azureInfo, azureProvider, ctx);
				}
			}
		});

		app.get("/auth/login/linkedin", ctx -> {
			OpenidProvider linkedinProvider = OpenidProvider.linkedin;
			switch (rsdProviders.accessMethodOfProvider(linkedinProvider)) {
				case MISCONFIGURED -> {
					handleMisconfiguredProvider(ctx, linkedinProvider);
				}
				case DISABLED -> {
					handleDisabledProvider(ctx, linkedinProvider);
				}
				case INVITE_ONLY -> {
					OpenIdInfo linkedinInfo = extractLinkedinInfo(ctx);

					handleAccountInviteOnly(linkedinInfo, linkedinProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo linkedinInfo = extractLinkedinInfo(ctx);

					handleAccountEveryoneAllowed(linkedinInfo, linkedinProvider, ctx);
				}
			}
		});

		if (Config.isLinkedinCouplingEnabled()) {
			app.get("/auth/couple/linkedin", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.linkedinRedirectCouple();
				OpenIdInfo linkedinInfo = new LinkedinLogin(code, redirectUrl).openidInfo();

				String tokenToVerify = ctx.cookie("rsd_token");
				String signingSecret = Config.jwtSigningSecret();
				JwtVerifier verifier = new JwtVerifier(signingSecret);
				DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
				UUID accountId = UUID.fromString(decodedJWT.getClaim("account").asString());

				new PostgrestAccount(Config.backendBaseUrl()).coupleLogin(accountId, linkedinInfo, OpenidProvider.linkedin);

				setRedirectFromCookie(ctx);
			});
		}

		if (Config.isApiAccessTokenEnabled()) {

			//endpoint for generating new API access token
			app.post("/auth/accesstoken", ctx -> {
				String accountId = extractAccountFromCookie(ctx);

				String requestBody = ctx.body();
				JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();
				String displayName = jsonObject.get("display_name").getAsString();
				String expiresAt = jsonObject.get("expires_at").getAsString();

				try {
					String accessToken = Argon2Creator.generateNewAccessToken(accountId, displayName, expiresAt);
					ctx.result("{\"access_token\":\"" + accessToken + "\"}").contentType("application/json");
					ctx.status(201);
				} catch (RsdAccessTokenException e) {
					ctx.status(400).result(e.getMessage());
				}
			});

			app.before("/api/v2/*", ctx -> {
				String authHeader = ctx.header("Authorization");
				//if request from frontend, skip access token validation
				if (authHeader != null && authHeader.startsWith("Bearer ")) {
					String authToken = authHeader.substring(7);

					String[] tokenParts = authToken.split("\\.");
					String tokenID = tokenParts[0];
					String tokenString = tokenParts[1];

					Argon2Verifier verifier = new Argon2Verifier();
					Optional<String> validatedUser = verifier.verify(tokenString, tokenID);
					if (validatedUser.isPresent()) {
						String userID = validatedUser.get();
						String signingSecret = Config.jwtSigningSecret();
						JwtCreator jwtCreator = new JwtCreator(signingSecret);
						String token = jwtCreator.createAccessTokenJwt(userID, tokenID);
						ctx.attribute("X-API-Authorization-Header", "Bearer " + token);
					} else {
						ctx.status(401).result("Invalid access token");
						throw new RsdAccessTokenException("Invalid access token");
					}

				} else {
					System.out.println(">>> Authorization header missing - forwarding request as anonymous");
				}
			});

			app.get("/api/v2/*", Main::proxyToPostgrest);
			app.post("/api/v2/*", Main::proxyToPostgrest);
			app.put("/api/v2/*", Main::proxyToPostgrest);
			app.patch("/api/v2/*", Main::proxyToPostgrest);
			app.delete("/api/v2/*", Main::proxyToPostgrest);
		}

		app.get("/auth/refresh", ctx -> {
			try {
				String tokenToVerify = ctx.cookie("rsd_token");
				String signingSecret = Config.jwtSigningSecret();
				JwtVerifier verifier = new JwtVerifier(signingSecret);
				verifier.verify(tokenToVerify);

				JwtCreator jwtCreator = new JwtCreator(signingSecret);
				String token = jwtCreator.refreshToken(tokenToVerify);
				setJwtCookie(ctx, token);
			} catch (RuntimeException ex) {
				LOGGER.error("RuntimeException", ex);
				ctx.status(400);
				ctx.json("{\"message\": \"failed to refresh token\"}");
			}
		});

		app.exception(JWTVerificationException.class, (ex, ctx) -> {
			LOGGER.error("JWTVerificationException", ex);
			ctx.status(400);
			ctx.json("{\"message\": \"invalid JWT\"}");
		});

		app.exception(RsdAuthenticationException.class, (ex, ctx) -> {
			setLoginFailureCookie(ctx, ex.getMessage());
			ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
		});

		app.exception(UnverifiedAccessTokenException.class, (ex, ctx) -> {
			LOGGER.error("UnverifiedAccessTokenException", ex);
			ctx.status(400);
			ctx.json("{\"message\": \"Cannot verify access token\"}");
		});

		app.exception(RsdAccessTokenException.class, (ex, ctx) -> {
			LOGGER.error("RsdAccessTokenException", ex);
			ctx.status(400);
			ctx.json("{\"message\": \"Error when creating access token\"}");
		});

		app.exception(RsdInvalidHeaderException.class, (ex, ctx) -> {
			LOGGER.error("RsdInvalidHeaderException", ex);
			ctx.status(400);
			ctx.json("{\"message\": \"Forbidden or invalid header\"}");
		});

		app.exception(RsdAccountInviteException.class, (ex, ctx) -> {
			setLoginFailureCookie(ctx, ex.getMessage());
			ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
		});

		app.exception(RuntimeException.class, (ex, ctx) -> {
			LOGGER.error("RuntimeException", ex);
			setLoginFailureCookie(ctx, "Something unexpected went wrong, please try again or contact us.");
			ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
		});

		app.exception(Exception.class, (ex, ctx) -> {
			LOGGER.error("Exception", ex);
			setLoginFailureCookie(ctx, "Something unexpected went wrong, please try again or contact us.");
			ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
		});
	}

	static OpenIdInfo extractLocalInfo(Context ctx) {
		String sub = ctx.formParam("sub");
		if (sub == null || sub.isBlank()) throw new RuntimeException("Please provide a username");
		String name = sub;
		String email = sub + "@example.com";
		String organisation = "Example organisation";
		Map<String, List<String>> emptyData = Collections.emptyMap();
		return new OpenIdInfo(sub, name, email, organisation, emptyData);
	}

	static OpenIdInfo extractSurfInfo(Context ctx) throws RsdResponseException, IOException, InterruptedException {
		String code = ctx.formParam("code");
		String redirectUrl = Config.surfconextRedirect();
		return new SurfconextLogin(code, redirectUrl).openidInfo();
	}

	static OpenIdInfo extractHelmholtzInfo(Context ctx) throws IOException, InterruptedException {
		String code = ctx.queryParam("code");
		String redirectUrl = Config.helmholtzIdRedirect();
		return new HelmholtzIdLogin(code, redirectUrl).openidInfo();
	}

	static OpenIdInfo extractOrcidInfo(Context ctx) throws RsdResponseException, IOException, InterruptedException {
		String code = ctx.queryParam("code");
		String redirectUrl = Config.orcidRedirect();
		return new OrcidLogin(code, redirectUrl).openidInfo();
	}

	static OpenIdInfo extractAzureInfo(Context ctx) throws RsdResponseException, IOException, InterruptedException {
		String code = ctx.queryParam("code");
		String redirectUrl = Config.azureRedirect();
		return new AzureLogin(code, redirectUrl).openidInfo();
	}

	static OpenIdInfo extractLinkedinInfo(Context ctx) throws RsdResponseException, IOException, InterruptedException {
		String code = ctx.queryParam("code");
		String redirectUrl = Config.linkedinRedirect();
		return new LinkedinLogin(code, redirectUrl).openidInfo();
	}

	static void handleAccountInviteOnly(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx) throws IOException, InterruptedException, RsdAccountInviteException, PostgresCustomException, PostgresForeignKeyConstraintException {
		PostgrestAccount postgrestAccount = new PostgrestAccount(Config.backendBaseUrl());
		Optional<AccountInfo> optionalAccountInfo = postgrestAccount.getAccountIfExists(openIdInfo, provider);
		if (optionalAccountInfo.isPresent()) {
			createAndSetCookie(ctx, optionalAccountInfo.get());
		} else {
			UUID inviteId = getInviteIdFromRequest(ctx);
			AccountInfo accountInfo = postgrestAccount.useInviteToCreateAccount(inviteId, openIdInfo, provider);
			createAndSetCookie(ctx, accountInfo);
		}
	}

	static void handleAccountEveryoneAllowed(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx) throws IOException, InterruptedException, PostgresCustomException, PostgresForeignKeyConstraintException {
		AccountInfo accountInfo = new PostgrestAccount(Config.backendBaseUrl()).account(openIdInfo, provider);
		createAndSetCookie(ctx, accountInfo);
	}

	static void handleDisabledProvider(Context ctx, OpenidProvider provider) {
		String message = "The provider \"%s\", is disabled, please try a different provider.".formatted(provider.toUserFriendlyString());
		setLoginFailureCookie(ctx, message);
		ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
	}

	static void handleMisconfiguredProvider(Context ctx, OpenidProvider provider) {
		String message = "The provider \"%s\", is misconfigured, please contact your RSD admins.".formatted(provider.toUserFriendlyString());
		setLoginFailureCookie(ctx, message);
		ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
	}

	static UUID getInviteIdFromRequest(Context ctx) throws RsdAccountInviteException {
		String cookie = ctx.cookie(INVITE_COOKIE_NAME);
		if (cookie == null) {
			throw new RsdAccountInviteException("No invite found to create an account");
		}

		try {
			return UUID.fromString(cookie);
		} catch (IllegalArgumentException e) {
			throw new RsdAccountInviteException("Received invalid invite ID", e);
		}
	}

	static void createAndSetCookie(Context ctx, AccountInfo accountInfo) {
		String token = createToken(accountInfo);
		setJwtCookie(ctx, token);
		setRedirectFromCookie(ctx);
	}

	static String createToken(AccountInfo accountInfo) {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		return jwtCreator.createUserJwt(accountInfo);
	}

	static void setJwtCookie(Context ctx, String token) {
		ctx.header("Set-Cookie", "rsd_token=" + token + "; Secure; HttpOnly; Path=/; SameSite=Lax; Max-Age=" + AUTH_COOKIE_DURATION.toSeconds());
	}

	static void setLoginFailureCookie(Context ctx, String message) {
		ctx.header("Set-Cookie", "rsd_login_failure_message=" + message + "; Secure; Path=/login/failed; SameSite=Lax; Max-Age=" + FAILURE_COOKIE_DURATION.toSeconds());
	}

	static void setRedirectFromCookie(Context ctx) {
		String returnPath = ctx.cookie("rsd_pathname");
		if (returnPath != null && !returnPath.isBlank()) {
			returnPath = returnPath.trim();
			ctx.redirect(returnPath, HttpStatus.SEE_OTHER);
		} else {
			ctx.redirect("/", HttpStatus.SEE_OTHER);
		}
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}

	static String extractAccountFromCookie(Context ctx) {
		String tokenToVerify = ctx.cookie("rsd_token");
		String signingSecret = Config.jwtSigningSecret();
		JwtVerifier verifier = new JwtVerifier(signingSecret);
		DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
		return decodedJWT.getClaim("account").asString();
	}

	private static void proxyToPostgrest(Context ctx) throws IOException, InterruptedException {
		String method = ctx.method().toString();
		String path = ctx.path().substring("/api/v2".length());
		String fullUrl = Config.backendBaseUrl() + path + ((ctx.queryString() != null) ? "?" + ctx.queryString() : "");

		HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
				.uri(URI.create(fullUrl));

		if (ctx.attribute("X-API-Authorization-Header") != null) {
			requestBuilder.header("Authorization", ctx.attribute("X-API-Authorization-Header"));
		}

		ctx.headerMap().forEach((k, v) -> {
			if (!Utils.isForbiddenHeader(k) && !k.equalsIgnoreCase("authorization") && v != null) {
				try {
					requestBuilder.header(k, v);
				} catch (IllegalArgumentException e) {
					throw new RsdInvalidHeaderException("Received invalid or forbidden header", e);
				}

			}
		});

		HttpRequest request = switch (method) {
			case "GET", "DELETE" -> requestBuilder.method(method, HttpRequest.BodyPublishers.noBody()).build();
			case "POST", "PUT", "PATCH" -> {
				String body = ctx.body();
				String contentType = ctx.contentType() != null ? ctx.contentType() : "application/json";
				requestBuilder.header("Content-Type", contentType);
				yield requestBuilder.method(method, HttpRequest.BodyPublishers.ofString(body)).build();
			}
			default -> throw new IllegalArgumentException("Unsupported HTTP method: " + method);
		};

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		ctx.status(response.statusCode());
		ctx.json(response.body());
	}
}
