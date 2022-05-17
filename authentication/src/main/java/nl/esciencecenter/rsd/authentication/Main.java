package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.Base64;

public class Main {
	static final long ONE_HOUR_IN_SECONDS = 3600; // 60 * 60

	public static void main(String[] args) {
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.json("{\"Module\": \"rsd/auth\", \"Status\": \"live\"}"));

		app.post("/login/local", ctx -> {
			try {
				String returnPath = ctx.cookie("rsd_pathname");
				JsonObject body = JsonParser.parseString(ctx.body()).getAsJsonObject();
				String sub = Utils.jsonElementToString(body.get("sub"));
				String name = Utils.jsonElementToString(body.get("name"));
				String email = Utils.jsonElementToString(body.get("email"));
				String organisation = Utils.jsonElementToString(body.get("organisation"));
				OpenIdInfo localInfo = new OpenIdInfo(sub, name, email, organisation);
				AccountInfo accountInfo = new PostgrestAccount(localInfo, "local").account();
				JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
				String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
				setJwtCookie(ctx, token);
				// redirect based on returnPath
				if (returnPath != null && !returnPath.trim().isEmpty()) {
					returnPath = returnPath.trim();
					ctx.redirect(returnPath);
				} else {
					ctx.redirect("/");
				}
			} catch (RuntimeException ex) {
				ex.printStackTrace();
				ctx.status(400);
				ctx.redirect("/login/failed");
			}
		});

		app.post("/login/surfconext", ctx -> {
			try {
				String returnPath = ctx.cookie("rsd_pathname");
				String code = ctx.formParam("code");
				String redirectUrl = Config.surfconextRedirect();
				OpenIdInfo surfconextInfo = new SurfconextLogin(code, redirectUrl).openidInfo();
				AccountInfo accountInfo = new PostgrestAccount(surfconextInfo, "surfconext").account();
				JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
				String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
				setJwtCookie(ctx, token);
				// redirect based on returnPath
				if (returnPath != null && !returnPath.trim().isEmpty()) {
					returnPath = returnPath.trim();
					ctx.redirect(returnPath);
				} else {
					ctx.redirect("/");
				}
			} catch (RuntimeException ex) {
				ex.printStackTrace();
				ctx.status(400);
				ctx.redirect("/login/failed");
			}
		});

		app.get("/login/helmholtzaai", ctx -> {
			try {
				String returnPath = ctx.cookie("rsd_pathname");
				String code = ctx.queryParam("code");
				String redirectUrl = Config.helmholtzAaiRedirect();
				OpenIdInfo helmholtzInfo = new HelmholtzAaiLogin(code, redirectUrl).openidInfo();
				AccountInfo accountInfo = new PostgrestAccount(helmholtzInfo, "helmholtz").account();
				JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
				String token = jwtCreator.createUserJwt(accountInfo.account(), accountInfo.name());
				setJwtCookie(ctx, token);

				// redirect based on returnPath
				if (returnPath != null && !returnPath.trim().isEmpty()) {
					returnPath = returnPath.trim();
					ctx.redirect(returnPath);
				} else {
					ctx.redirect("/");
				}
			} catch (RuntimeException ex) {
				ex.printStackTrace();
				ctx.status(400);
				ctx.redirect("/login/failed");
			}
		});

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

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}
}
