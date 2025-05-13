// SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Duration;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class Main {
	private static final Duration AUTH_COOKIE_DURATION = Duration.ofHours(1);
	private static final Duration FAILURE_COOKIE_DURATION = Duration.ofMinutes(1);
	private static final String INVITE_COOKIE_NAME = "rsd_invite_id";

	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
	private static final String LOGIN_FAILED_PATH = "/login/failed";

	public static boolean idUserIsHelmholtzMember(OpenIdInfo helmholtzInfo) {
		if (helmholtzInfo.organisation() == null) {
			return false;
		} else {
			return true;
		}
	}

	public static void main(String[] args) {
		Init.checkConfigAndPrintStatus();
		Javalin app = Javalin.create(c -> c.useVirtualThreads = false).start(7000);

		app.afterMatched("/login/*", ctx -> {
			ctx.removeCookie(INVITE_COOKIE_NAME, "/auth");
		});

		app.get("/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		app.post("/login/local", ctx -> {
			OpenidProvider localProvider = OpenidProvider.local;
			switch (Config.accessMethodOfProvider(localProvider)) {
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

		app.post("/login/surfconext", ctx -> {
			OpenidProvider surfProvider = OpenidProvider.surfconext;
			switch (Config.accessMethodOfProvider(surfProvider)) {
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

		app.get("/login/helmholtzid", ctx -> {
			OpenidProvider helmholtzProvider = OpenidProvider.helmholtz;
			switch (Config.accessMethodOfProvider(helmholtzProvider)) {
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

		app.get("/login/orcid", ctx -> {
			OpenidProvider orcidProvider = OpenidProvider.orcid;
			switch (Config.accessMethodOfProvider(orcidProvider)) {
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
			app.get("/couple/orcid", ctx -> {
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

		app.get("/login/azure", ctx -> {
			OpenidProvider azureProvider = OpenidProvider.azure;
			switch (Config.accessMethodOfProvider(azureProvider)) {
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

		app.get("login/linkedin", ctx -> {
			OpenidProvider linkedinProvider = OpenidProvider.linkedin;
			switch (Config.accessMethodOfProvider(linkedinProvider)) {
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
			app.get("/couple/linkedin", ctx -> {
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

		app.get("/refresh", ctx -> {
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

	static void handleAccountInviteOnly(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx) throws IOException, InterruptedException, RsdAccountInviteException {
		PostgrestAccount postgrestAccount = new PostgrestAccount(Config.backendBaseUrl());
		Optional<AccountInfo> optionalAccountInfo = postgrestAccount.getAccountIfExists(openIdInfo, provider);
		if (optionalAccountInfo.isPresent()) {
			createAndSetToken(ctx, optionalAccountInfo.get());
		} else {
			UUID inviteId = getInviteIdFromRequest(ctx);
			AccountInfo accountInfo = postgrestAccount.useInviteToCreateAccount(inviteId, openIdInfo, provider);
			createAndSetToken(ctx, accountInfo);
		}
	}

	static void handleAccountEveryoneAllowed(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx) throws IOException, InterruptedException {
		AccountInfo accountInfo = new PostgrestAccount(Config.backendBaseUrl()).account(openIdInfo, provider);
		createAndSetToken(ctx, accountInfo);
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

	static void createAndSetToken(Context ctx, AccountInfo accountInfo) {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createUserJwt(accountInfo);
		setJwtCookie(ctx, token);
		setRedirectFromCookie(ctx);
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
}
