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

		app.post("/login/surfconext", ctx -> {
			try {
				String returnPath = ctx.cookie("rsd_pathname");
				String code = ctx.formParam("code");
				String redirectUrl = Config.surfconextRedirect();
				String account = new SurfconextLogin(code, redirectUrl).account();
				JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
				String token = jwtCreator.createUserJwt(account);
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
			ctx.json("{\"Message\": \"invalid JWT\"}");
		});
	}

	static void setJwtCookie(Context ctx, String token) {
		ctx.header("Set-Cookie", "rsd_token=" + token + "; Secure; HttpOnly; Path=/; SameSite=Lax; Max-Age=" + ONE_HOUR_IN_SECONDS);
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}
}
