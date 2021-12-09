package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.Javalin;

import java.util.Base64;
import java.util.Date;

public class Main {

	static final String JWT_SECRET = "someSecret";
	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60* 60* 1000

	public static void main(String[] args) {
		Javalin app = Javalin.create().start(7000);
		app.get("/", ctx -> ctx.result("Hello World!"));

		app.get("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(JWT_SECRET);
			String token = JWT.create()
					.withClaim("role", "authenticated")
					.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
					.sign(signingAlgorithm);
			ctx.result(token);
			System.out.println(System.currentTimeMillis());
		});

		app.post("/login", ctx -> {
			Algorithm signingAlgorithm = Algorithm.HMAC256(JWT_SECRET);
			String token = ctx.body();
			JWTVerifier verifier = JWT.require(signingAlgorithm).build();
			DecodedJWT decodedJWT = verifier.verify(token);
			ctx.result(decode(decodedJWT.getHeader()) + "\n" + decode(decodedJWT.getPayload()));
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
