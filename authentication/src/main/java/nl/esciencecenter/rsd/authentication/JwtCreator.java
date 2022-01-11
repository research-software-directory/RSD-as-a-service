package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.Gson;

import java.util.Date;
import java.util.Map;

public class JwtCreator {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	final String SIGNING_SECRET;
	final Algorithm SIGNING_ALGORITHM;

	public JwtCreator(String signingSecret) {
		if (signingSecret == null) throw new IllegalArgumentException("The signing secret should not be null");
		this.SIGNING_SECRET = signingSecret;
		this.SIGNING_ALGORITHM = Algorithm.HMAC256(SIGNING_SECRET);
	}

	String createUserJwt(String account) {
		return JWT.create()
				.withClaim("iss", "rsd_auth")
				.withClaim("role", "rsd_user")
				.withClaim("account", account)
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(SIGNING_ALGORITHM);
	}

	String createAdminJwt() {
		return JWT.create()
				.withClaim("iss", "rsd_auth")
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(SIGNING_ALGORITHM);
	}

	String refreshToken(String token) {
		DecodedJWT oldJwt = JWT.decode(token);
		String payloadEncoded = oldJwt.getPayload();
		String payloadDecoded = Main.decode(payloadEncoded);
		Gson gson = new Gson();
		Map claimsMap = gson.fromJson(payloadDecoded, Map.class);
		return JWT.create()
				.withPayload(claimsMap)
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(SIGNING_ALGORITHM);
	}
}
