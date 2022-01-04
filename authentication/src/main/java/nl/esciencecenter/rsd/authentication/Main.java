package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.Javalin;

import java.io.FileReader;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.Properties;

public class Main {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	static final Properties CONFIG = new Properties();

	public static void main(String[] args) throws IOException {
		CONFIG.load(new FileReader(args[0]));
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.result("Hello World!"));

		app.get("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(CONFIG.getProperty("PGRST_JWT_SECRET"));
			String token = JWT.create()
					.withClaim("role", "rsd_user")
					.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
					.sign(signingAlgorithm);
			ctx.result(token);
		});

		app.post("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(CONFIG.getProperty("PGRST_JWT_SECRET"));
			String token = ctx.body();
			JWTVerifier verifier = JWT.require(signingAlgorithm).build();
			DecodedJWT decodedJWT = verifier.verify(token);
			ctx.result(decode(decodedJWT.getHeader()) + "\n" + decode(decodedJWT.getPayload()));
		});

		app.post("/login/surfconext", ctx -> {
			String code = ctx.formParam("code");
			String redirectUrl = CONFIG.getProperty("AUTH_SURFCONEXT_REDIRECT_URL");
			String account = new SurfconextLogin(code, redirectUrl).account();
			JwtCreator jwtCreator = new JwtCreator(CONFIG.getProperty("PGRST_JWT_SECRET"));
			String token = jwtCreator.createUserJwt(account);
			ctx.cookie("rsd_token", token);
			ctx.result(token);
		});

		app.get("/login/surfconext", ctx -> {
			String redirectUrl = CONFIG.getProperty("AUTH_SURFCONEXT_REDIRECT_URL");
			ctx.html("<a href=\"https://connect.test.surfconext.nl/oidc/authorize?scope=openid&&response_type=code&redirect_uri=" + redirectUrl + "&state=example&nonce=example&response_mode=form_post&client_id=" + CONFIG.getProperty("AUTH_SURFCONEXT_CLIENT_ID") + "\">Login with surfconext</a>");
		});

		app.exception(JWTVerificationException.class, (ex, ctx) -> {
			ex.printStackTrace();
			ctx.result("Invalid JWT!");
		});
	}

	static String decode(String base64UrlEncoded) {
		return new String(Base64.getUrlDecoder().decode(base64UrlEncoded));
	}
}
