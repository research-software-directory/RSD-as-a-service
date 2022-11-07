// SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.exceptions.JWTVerificationException;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.Base64;

public class Main {
	static final long ONE_HOUR_IN_SECONDS = 3600; // 60 * 60
	static final long ONE_MINUTE_IN_SECONDS = 60;

	public static boolean userIsAllowed(OpenIdInfo info) {
		String whitelist = Config.userMailWhitelist();

		if (whitelist == null || whitelist.length() == 0) {
			// allow any user
			return true;
		}

		if (info == null || info.email() == null || info.email().length() == 0) {
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

	public static void main(String[] args) {
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		if (Config.isLocalEnabled()) {
			System.out.println("********************");
			System.out.println("Warning: local accounts are enabled, this is not safe for production!");
			System.out.println("********************");
			app.post("/login/local", ctx -> {
				String sub = ctx.formParam("sub");
				if (sub == null || sub.isBlank()) throw new RuntimeException("Please provide a username");
				String name = sub;
				String email = sub + "@example.com";
				String organisation = "Example organisation";
				OpenIdInfo localInfo = new OpenIdInfo(sub, name, email, organisation);

				AccountInfo accountInfo = new PostgrestAccount().account(localInfo, OpenidProvider.local);
				boolean isAdmin = isAdmin(email);
				createAndSetToken(ctx, accountInfo, isAdmin);
			});
		}

		if (Config.isSurfConextEnabled()) {
			app.post("/login/surfconext", ctx -> {
				String code = ctx.formParam("code");
				String redirectUrl = Config.surfconextRedirect();
				OpenIdInfo surfconextInfo = new SurfconextLogin(code, redirectUrl).openidInfo();

				if (!userIsAllowed(surfconextInfo)) {
					throw new RsdAuthenticationException("Your email address (" + surfconextInfo.email() + ") is not whitelisted.");
				}

				AccountInfo accountInfo = new PostgrestAccount().account(surfconextInfo, OpenidProvider.surfconext);
				String email = surfconextInfo.email();
				boolean isAdmin = isAdmin(email);
				createAndSetToken(ctx, accountInfo, isAdmin);
			});
		}

		if (Config.isHelmholtzEnabled()) {
			app.get("/login/helmholtzaai", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.helmholtzAaiRedirect();
				OpenIdInfo helmholtzInfo = new HelmholtzAaiLogin(code, redirectUrl).openidInfo();

				if (!userIsAllowed(helmholtzInfo)) {
					throw new RsdAuthenticationException("Your email address (" + helmholtzInfo.email() + ") is not whitelisted.");
				}

				AccountInfo accountInfo = new PostgrestAccount().account(helmholtzInfo, OpenidProvider.helmholtz);
				String email = helmholtzInfo.email();
				boolean isAdmin = isAdmin(email);
				createAndSetToken(ctx, accountInfo, isAdmin);
			});
		}

		if (Config.isOrcidEnabled()) {
			app.get("/login/orcid", ctx -> {
				String code = ctx.queryParam("code");
				String redirectUrl = Config.orcidRedirect();
				OpenIdInfo orcidInfo = new OrcidLogin(code, redirectUrl).openidInfo();

				AccountInfo accountInfo = new PostgrestCheckOrcidWhitelistedAccount(new PostgrestAccount()).account(orcidInfo, OpenidProvider.orcid);
				String email = orcidInfo.email();
				boolean isAdmin = isAdmin(email);
				createAndSetToken(ctx, accountInfo, isAdmin);
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
				ex.printStackTrace();
				ctx.status(400);
				ctx.json("{\"message\": \"failed to refresh token\"}");
			}
		});

		app.exception(JWTVerificationException.class, (ex, ctx) -> {
			ex.printStackTrace();
			ctx.status(400);
			ctx.json("{\"message\": \"invalid JWT\"}");
		});

		app.exception(RsdAuthenticationException.class, (ex, ctx) -> {
			setLoginFailureCookie(ctx, ex.getMessage());
			ctx.redirect("/login/failed");
		});

		app.exception(RuntimeException.class, (ex, ctx) -> {
			ex.printStackTrace();
			setLoginFailureCookie(ctx, "Something unexpected went wrong, please try again or contact us.");
			ctx.redirect("/login/failed");
		});
	}

	static boolean isAdmin(String email) {
		return email != null && !email.isBlank() && Config.rsdAdmins().contains(email);
	}

	static void createAndSetToken(Context ctx, AccountInfo accountInfo, boolean isAdmin) {
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name(), isAdmin);
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
