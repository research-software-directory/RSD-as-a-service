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

	public static void main(String[] args) {
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		if (Config.isLocalEnabled()) {
			app.post("/login/local", ctx -> {
				try {
					String sub = ctx.formParam("sub");
					if (sub == null || sub.isBlank()) throw new RuntimeException("Please provide a username");
					String name = sub;
					String email = sub + "@example.com";
					String organisation = "Example organisation";
					OpenIdInfo localInfo = new OpenIdInfo(sub, name, email, organisation);

					AccountInfo accountInfo = new PostgrestAccount(localInfo, "local").account();
					JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
					String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
					setJwtCookie(ctx, token);
					setRedirectFromCookie(ctx);
				} catch (RuntimeException ex) {
					ex.printStackTrace();
					ctx.status(400);
					ctx.redirect("/login/failed");
				}
			});
		}

		if (Config.isSurfConextEnabled()) {
			app.post("/login/surfconext", ctx -> {
				try {
					String code = ctx.formParam("code");
					String redirectUrl = Config.surfconextRedirect();
					OpenIdInfo surfconextInfo = new SurfconextLogin(code, redirectUrl).openidInfo();
					AccountInfo accountInfo = new PostgrestAccount(surfconextInfo, "surfconext").account();

					JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
					String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
					setJwtCookie(ctx, token);
					setRedirectFromCookie(ctx);
				} catch (RuntimeException ex) {
					ex.printStackTrace();
					ctx.status(400);
					ctx.redirect("/login/failed");
				}
			});
		}

		if (Config.isHelmholtzEnabled()) {
			app.get("/login/helmholtzaai", ctx -> {
				try {
					String code = ctx.queryParam("code");
					String redirectUrl = Config.helmholtzAaiRedirect();
					OpenIdInfo helmholtzInfo = new HelmholtzAaiLogin(code, redirectUrl).openidInfo();

					AccountInfo accountInfo = new PostgrestAccount(helmholtzInfo, "helmholtz").account();
					JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
					String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
					setJwtCookie(ctx, token);
					setRedirectFromCookie(ctx);
				} catch (RuntimeException ex) {
					ex.printStackTrace();
					ctx.status(400);
					ctx.redirect("/login/failed");
				}
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
	}

	static void setJwtCookie(Context ctx, String token) {
		ctx.header("Set-Cookie", "rsd_token=" + token + "; Secure; HttpOnly; Path=/; SameSite=Lax; Max-Age=" + ONE_HOUR_IN_SECONDS);
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
