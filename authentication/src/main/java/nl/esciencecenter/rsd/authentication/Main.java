// SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.Javalin;
import io.javalin.http.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class Main {
	static final long ONE_HOUR_IN_SECONDS = 3600; // 60 * 60
	static final long ONE_MINUTE_IN_SECONDS = 60;

	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
	private static final String LOGIN_FAILED_PATH = "/login/failed";

	public static boolean userIsAllowed(OpenIdInfo info) {
		String whitelist = Config.userMailWhitelist();

		if (whitelist == null || whitelist.isEmpty()) {
			// allow any user
			return true;
		}

		if (info == null || info.email() == null || info.email().isEmpty()) {
			throw new Error("Unexpected parameters for 'userIsAllowed'");
		}

		String[] allowed = whitelist.split(";");

		for (String s : allowed) {
			if (s.equalsIgnoreCase(info.email())) {
				return true;
			}
		}

		return false;
	}

	public static boolean userInIdAllowList(OpenIdInfo info) {
		String allowList = Config.helmholtzIdAllowList();

		if (!Config.helmholtzIdUseAllowList() || allowList == null || allowList.isEmpty()) {
			return false;
		}

		if (info == null || info.email() == null || info.email().isEmpty()) {
			throw new Error("Unexpected parameters for 'userInIdAllowList'");
		}

		String[] allowed = allowList.split(";");

		for (String s : allowed) {
			if (s.equalsIgnoreCase(info.email())) {
				return true;
			}
		}

		return false;
	}

	public static boolean idUserIsAllowed(OpenIdInfo helmholtzInfo) {
		if (Config.helmholtzIdAllowExternalUsers()) {
			return true;
		}
		if (helmholtzInfo.organisation() == null) {
			if (Config.helmholtzIdUseAllowList() && userInIdAllowList(helmholtzInfo)) {
				return true;
			} else if (Config.helmholtzIdUseAllowList()) {
				throw new RsdAuthenticationException("Your email address (" + helmholtzInfo.email() + ") is not in the allow list.");
			}
		} else {
			// User is in HGF organisation
			return true;
		}
		return false;
	}

	public static void main(String[] args) {
		Javalin app = Javalin.create(c -> c.useVirtualThreads = false).start(7000);
		app.get("/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		if (Config.isLocalLoginEnabled()) {
			System.out.println("********************");
			System.out.println("Warning: local accounts are enabled, this is not safe for production!");
			System.out.println("********************");
			app.post("/login/local", ctx -> {
				String sub = ctx.formParam("sub");
				if (sub == null || sub.isBlank()) throw new RuntimeException("Please provide a username");
				String name = sub;
				String email = sub + "@example.com";
				String organisation = "Example organisation";
				Map<String, List<String>> emptyData = Collections.emptyMap();
				OpenIdInfo localInfo = new OpenIdInfo(sub, name, email, organisation, emptyData);

				AccountInfo accountInfo = new PostgrestAccount().account(localInfo, OpenidProvider.local);
				createAndSetToken(ctx, accountInfo);
			});
		}

		if (Config.isSurfConextLoginEnabled()) {
			app.post("/login/surfconext", ctx -> {
				String code = ctx.formParam("code");
				String redirectUrl = Config.surfconextRedirect();
				OpenIdInfo surfconextInfo = new SurfconextLogin(code, redirectUrl).openidInfo();

				if (!userIsAllowed(surfconextInfo)) {
					throw new RsdAuthenticationException("Your email address (" + surfconextInfo.email() + ") is not whitelisted.");
				}

				AccountInfo accountInfo = new PostgrestAccount().account(surfconextInfo, OpenidProvider.surfconext);
				createAndSetToken(ctx, accountInfo);
			});
		}

		if (Config.isHelmholtzLoginEnabled()) {
			app.get("/login/helmholtzid", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.helmholtzIdRedirect();
				OpenIdInfo helmholtzInfo = new HelmholtzIdLogin(code, redirectUrl).openidInfo();

				if (!idUserIsAllowed(helmholtzInfo)) {
					throw new RsdAuthenticationException("You are not allowed to log in.");
				}

				AccountInfo accountInfo = new PostgrestAccount().account(helmholtzInfo, OpenidProvider.helmholtz);
				createAndSetToken(ctx, accountInfo);
			});
		}

		if (Config.isOrcidLoginEnabled()) {
			app.get("/login/orcid", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.orcidRedirect();
				OpenIdInfo orcidInfo = new OrcidLogin(code, redirectUrl).openidInfo();

				AccountInfo accountInfo = new PostgrestCheckOrcidWhitelistedAccount(new PostgrestAccount()).account(orcidInfo, OpenidProvider.orcid);
				createAndSetToken(ctx, accountInfo);
			});
		}

		if (Config.isOrcidCoupleEnabled()) {
			app.get("/couple/orcid", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.orcidRedirectCouple();
				OpenIdInfo orcidInfo = new OrcidLogin(code, redirectUrl).openidInfo();

				String tokenToVerify = ctx.cookie("rsd_token");
				String signingSecret = Config.jwtSigningSecret();
				JwtVerifier verifier = new JwtVerifier(signingSecret);
				DecodedJWT decodedJWT = verifier.verify(tokenToVerify);
				UUID accountId = UUID.fromString(decodedJWT.getClaim("account").asString());

				new PostgrestAccount().coupleLogin(accountId, orcidInfo, OpenidProvider.orcid);

				PostgrestConnector.addOrcidToAllowList(orcidInfo.sub());

				setRedirectFromCookie(ctx);
			});
		}

		if (Config.isAzureLoginEnabled()) {
			app.get("/login/azure", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.azureRedirect();
				OpenIdInfo azureInfo = new AzureLogin(code, redirectUrl).openidInfo();
				AccountInfo accountInfo = new PostgrestAccount().account(azureInfo, OpenidProvider.azure);
				createAndSetToken(ctx, accountInfo);
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
			ctx.redirect(LOGIN_FAILED_PATH);
		});

		app.exception(RuntimeException.class, (ex, ctx) -> {
			LOGGER.error("RuntimeException", ex);
			setLoginFailureCookie(ctx, "Something unexpected went wrong, please try again or contact us.");
			ctx.redirect(LOGIN_FAILED_PATH);
		});

		app.exception(Exception.class, (ex, ctx) -> {
			LOGGER.error("Exception", ex);
			setLoginFailureCookie(ctx, "Something unexpected went wrong, please try again or contact us.");
			ctx.redirect(LOGIN_FAILED_PATH);
		});
	}

	static void createAndSetToken(Context ctx, AccountInfo accountInfo) {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createUserJwt(accountInfo);
		setJwtCookie(ctx, token);
		setRedirectFromCookie(ctx);
	}

	static void setJwtCookie(Context ctx, String token) {
		ctx.header("Set-Cookie", "rsd_token=" + token + "; Secure; HttpOnly; Path=/; SameSite=Lax; Max-Age=" + ONE_HOUR_IN_SECONDS);
	}

	static void setLoginFailureCookie(Context ctx, String message) {
		ctx.header("Set-Cookie", "rsd_login_failure_message=" + message + "; Secure; Path=/login/failed; SameSite=Lax; Max-Age=" + ONE_MINUTE_IN_SECONDS);
	}

	static void setRedirectFromCookie(Context ctx) {
		String returnPath = ctx.cookie("rsd_pathname");
		if (returnPath != null && !returnPath.isBlank()) {
			returnPath = returnPath.trim();
			ctx.redirect(returnPath);
		} else {
			ctx.redirect("/");
		}
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}
}
