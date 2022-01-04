package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;

public class JwtCreator {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	final String SIGNING_SECRET;

	public JwtCreator(String signingSecret) {
		if (signingSecret == null) throw new IllegalArgumentException("The signing secret should not be null");
		this.SIGNING_SECRET = signingSecret;
	}

	String createUserJwt(String account) {
		Algorithm signingAlgorithm = Algorithm.HMAC256(SIGNING_SECRET);
		return JWT.create()
				.withClaim("role", "rsd_user")
				.withClaim("account", account)
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
	}

	String createAdminJwt() {
		Algorithm signingAlgorithm = Algorithm.HMAC256(SIGNING_SECRET);
		return JWT.create()
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
	}
}
