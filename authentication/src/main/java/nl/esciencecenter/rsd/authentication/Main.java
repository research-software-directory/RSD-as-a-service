// SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import java.io.IOException;
import java.time.Duration;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import nl.esciencecenter.rsd.authentication.accesstoken.CreateAccessTokenHandler;
import nl.esciencecenter.rsd.authentication.accesstoken.ProxyWithAccessTokenBeforeHandler;
import nl.esciencecenter.rsd.authentication.accesstoken.ProxyWithAccessTokenHandler;
import nl.esciencecenter.rsd.authentication.accesstoken.RsdAccessTokenException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {

	private static final Duration AUTH_COOKIE_DURATION = Duration.ofHours(1);
	private static final Duration FAILURE_COOKIE_DURATION = Duration.ofMinutes(1);
	private static final String INVITE_COOKIE_NAME = "rsd_invite_id";

	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
	private static final String LOGIN_FAILED_PATH = "/login/failed";

	public static void main(String[] args) {
		RsdProviders rsdProviders = new RsdProviders();
		Javalin app = Javalin.create(c -> c.useVirtualThreads = false).start(7000);

		app.afterMatched("/auth/login/*", ctx -> ctx.removeCookie(INVITE_COOKIE_NAME, "/auth"));

		app.get("/auth/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		app.get("/auth/providers", ctx -> ctx.json(rsdProviders.activeProvidersAsJson()));

		app.post(RsdProviders.obtainLoginPath(OpenidProvider.local), ctx ->
			handleLoginRequest(ctx, OpenidProvider.local, rsdProviders)
		);

		app.post(RsdProviders.obtainCouplingPath(OpenidProvider.local), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.local, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.surfconext), ctx ->
			handleLoginRequest(ctx, OpenidProvider.surfconext, rsdProviders)
		);

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.surfconext), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.surfconext, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.helmholtz), ctx -> {
			OpenidProvider helmholtzProvider = OpenidProvider.helmholtz;
			switch (rsdProviders.accessMethodOfProvider(helmholtzProvider)) {
				case MISCONFIGURED -> handleMisconfiguredProvider(ctx, helmholtzProvider);
				case DISABLED -> handleDisabledProvider(ctx, helmholtzProvider);
				case INVITE_ONLY -> {
					OpenIdInfo helmholtzInfo = obtainOpenIdInfo(ctx, helmholtzProvider, false);

					handleAccountInviteOnly(helmholtzInfo, helmholtzProvider, ctx);
				}
				case EVERYONE -> {
					OpenIdInfo helmholtzInfo = obtainOpenIdInfo(ctx, helmholtzProvider, false);

					boolean idUserIsHelmholtzMember = helmholtzInfo.organisation() != null;
					if (!idUserIsHelmholtzMember && !Config.helmholtzIdAllowExternalUsers()) {
						// If no external members can login by default, access can be granted via invites
						handleAccountInviteOnly(helmholtzInfo, helmholtzProvider, ctx);
					} else {
						handleAccountEveryoneAllowed(helmholtzInfo, helmholtzProvider, ctx);
					}
				}
			}
		});

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.helmholtz), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.helmholtz, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.orcid), ctx ->
			handleLoginRequest(ctx, OpenidProvider.orcid, rsdProviders)
		);

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.orcid), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.orcid, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.azure), ctx ->
			handleLoginRequest(ctx, OpenidProvider.azure, rsdProviders)
		);

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.azure), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.azure, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.linkedin), ctx ->
			handleLoginRequest(ctx, OpenidProvider.linkedin, rsdProviders)
		);

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.linkedin), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.linkedin, rsdProviders)
		);

		app.get(RsdProviders.obtainLoginPath(OpenidProvider.github), ctx ->
			handleLoginRequest(ctx, OpenidProvider.github, rsdProviders)
		);

		app.get(RsdProviders.obtainCouplingPath(OpenidProvider.github), ctx ->
			handleCoupleRequest(ctx, OpenidProvider.github, rsdProviders)
		);

		if (Config.isApiAccessTokenEnabled()) {
			// endpoint for generating new API access token
			app.post("/auth/accesstoken", new CreateAccessTokenHandler());

			final String accessTokenApiPath = "/api/v2/*";
			app.beforeMatched(accessTokenApiPath, new ProxyWithAccessTokenBeforeHandler());

			// If an HTTP method get added or removed here, also adapt the switch statement in the ProxyWithAccessTokenHandler
			app.get(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.post(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.put(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.patch(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.delete(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.head(accessTokenApiPath, new ProxyWithAccessTokenHandler());
			app.options(accessTokenApiPath, new ProxyWithAccessTokenHandler());
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
			setLoginFailureCookieAndRedirect(ctx, ex.getMessage());
		});

		app.exception(RsdAccessTokenException.class, (ex, ctx) -> {
			LOGGER.error("RsdAccessTokenException", ex);
			ctx.status(400);
			ctx.json("{\"message\": \"Error when creating access token\"}");
		});

		app.exception(RsdAccountInviteException.class, (ex, ctx) -> {
			setLoginFailureCookieAndRedirect(ctx, ex.getMessage());
		});

		app.exception(RuntimeException.class, (ex, ctx) -> {
			LOGGER.error("RuntimeException", ex);
			setLoginFailureCookieAndRedirect(ctx, "Something unexpected went wrong, please try again or contact us.");
		});

		app.exception(Exception.class, (ex, ctx) -> {
			LOGGER.error("Exception", ex);
			setLoginFailureCookieAndRedirect(ctx, "Something unexpected went wrong, please try again or contact us.");
		});
	}

	static void handleLoginRequest(Context ctx, OpenidProvider openidProvider, RsdProviders rsdProviders)
		throws RsdResponseException, IOException, InterruptedException, RsdAccountInviteException, IncorrectDataException {
		switch (rsdProviders.accessMethodOfProvider(openidProvider)) {
			case MISCONFIGURED -> handleMisconfiguredProvider(ctx, openidProvider);
			case DISABLED -> handleDisabledProvider(ctx, openidProvider);
			case INVITE_ONLY -> {
				OpenIdInfo openIdInfo = obtainOpenIdInfo(ctx, openidProvider, false);

				handleAccountInviteOnly(openIdInfo, openidProvider, ctx);
			}
			case EVERYONE -> {
				OpenIdInfo openIdInfo = obtainOpenIdInfo(ctx, openidProvider, false);

				handleAccountEveryoneAllowed(openIdInfo, openidProvider, ctx);
			}
		}
	}

	static void handleCoupleRequest(Context ctx, OpenidProvider openidProvider, RsdProviders rsdProviders)
		throws RsdResponseException, IOException, InterruptedException, IncorrectDataException {
		switch (rsdProviders.accessMethodOfProvider(openidProvider)) {
			case MISCONFIGURED -> handleMisconfiguredProvider(ctx, openidProvider);
			case DISABLED -> handleDisabledProvider(ctx, openidProvider);
			case INVITE_ONLY, EVERYONE -> {
				OpenIdInfo openIdInfo = obtainOpenIdInfo(ctx, openidProvider, true);

				handleCoupleLogins(ctx, openIdInfo, openidProvider);
			}
		}
	}

	static OpenIdInfo obtainOpenIdInfo(Context ctx, OpenidProvider openidProvider, boolean isCoupling)
		throws RsdResponseException, IOException, InterruptedException, IncorrectDataException {
		String redirectUrl = null;
		if (openidProvider != OpenidProvider.local) {
			redirectUrl = isCoupling
				? RsdProviders.obtainCouplingRedirectUrl(openidProvider)
				: RsdProviders.obtainRedirectUrl(openidProvider);
		}

		return switch (openidProvider) {
			case local -> {
				String sub = ctx.formParam("sub");
				if (sub == null || sub.isBlank()) {
					throw new IncorrectDataException("Please provide a username");
				}
				String name = sub;
				String email = sub + "@example.com";
				String organisation = "Example organisation";
				Map<String, List<String>> emptyData = Collections.emptyMap();
				yield new OpenIdInfo(sub, name, email, organisation, emptyData);
			}
			case surfconext -> {
				String code = ctx.queryParam("code");
				yield new SurfconextLogin(code, redirectUrl).openidInfo();
			}
			case helmholtz -> {
				String code = ctx.queryParam("code");
				yield new HelmholtzIdLogin(code, redirectUrl).openidInfo();
			}
			case orcid -> {
				String code = ctx.queryParam("code");
				yield new OrcidLogin(code, redirectUrl).openidInfo();
			}
			case azure -> {
				String code = ctx.queryParam("code");
				yield new AzureLogin(code, redirectUrl).openidInfo();
			}
			case linkedin -> {
				String code = ctx.queryParam("code");
				yield new LinkedinLogin(code, redirectUrl).openidInfo();
			}
			case github -> {
				String code = ctx.queryParam("code");
				yield new GithubLogin(code, redirectUrl).openidInfo();
			}
		};
	}

	static void handleAccountInviteOnly(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx)
		throws IOException, InterruptedException, RsdAccountInviteException, RsdResponseException {
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

	static void handleAccountEveryoneAllowed(OpenIdInfo openIdInfo, OpenidProvider provider, Context ctx)
		throws IOException, InterruptedException, RsdResponseException {
		AccountInfo accountInfo = new PostgrestAccount(Config.backendBaseUrl()).account(openIdInfo, provider);
		createAndSetCookie(ctx, accountInfo);
	}

	static void handleDisabledProvider(Context ctx, OpenidProvider provider) {
		String message = "The provider \"%s\", is disabled, please try a different provider.".formatted(
			provider.toUserFriendlyString()
		);
		setLoginFailureCookieAndRedirect(ctx, message);
	}

	static void handleMisconfiguredProvider(Context ctx, OpenidProvider provider) {
		String message = "The provider \"%s\", is misconfigured, please contact your RSD admins.".formatted(
			provider.toUserFriendlyString()
		);
		setLoginFailureCookieAndRedirect(ctx, message);
	}

	static void handleCoupleLogins(Context ctx, OpenIdInfo openIdInfo, OpenidProvider provider)
		throws IOException, InterruptedException, RsdResponseException {
		String tokenToVerify = ctx.cookie("rsd_token");
		String signingSecret = Config.jwtSigningSecret();
		JwtVerifier verifier = new JwtVerifier(signingSecret);
		DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
		UUID accountId = UUID.fromString(decodedJWT.getClaim("account").asString());

		new PostgrestAccount(Config.backendBaseUrl()).coupleLogin(accountId, openIdInfo, provider);

		setRedirectFromCookie(ctx);
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
		if (accountInfo.isLocked()) {
			setLoginFailureCookieAndRedirect(
				ctx,
				"Your account is locked. " + accountInfo.lockReason().orElse("no reason given")
			);
			return;
		}

		String token = createToken(accountInfo);
		setJwtCookie(ctx, token);
		setRedirectFromCookie(ctx);
	}

	static String createToken(AccountInfo accountInfo) {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		return jwtCreator.createUserJwt(accountInfo);
	}

	static void setJwtCookie(Context ctx, String token) {
		ctx.header(
			"Set-Cookie",
			"rsd_token=" +
			token +
			"; Secure; HttpOnly; Path=/; SameSite=Lax; Max-Age=" +
			AUTH_COOKIE_DURATION.toSeconds()
		);
	}

	static void setLoginFailureCookieAndRedirect(Context ctx, String message) {
		ctx.header(
			"Set-Cookie",
			"rsd_login_failure_message=" +
			message +
			"; Secure; Path=/login/failed; SameSite=Lax; Max-Age=" +
			FAILURE_COOKIE_DURATION.toSeconds()
		);

		ctx.redirect(LOGIN_FAILED_PATH, HttpStatus.SEE_OTHER);
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

	public static String extractAccountFromCookie(Context ctx) {
		String tokenToVerify = ctx.cookie("rsd_token");
		String signingSecret = Config.jwtSigningSecret();
		JwtVerifier verifier = new JwtVerifier(signingSecret);
		DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
		return decodedJWT.getClaim("account").asString();
	}
}
