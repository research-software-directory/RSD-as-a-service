package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

public class JwtVerifier {

	final String SIGNING_SECRET;

	public JwtVerifier(String signingSecret) {
		if (signingSecret == null) throw new IllegalArgumentException("The signing secret should not be null");
		this.SIGNING_SECRET = signingSecret;
	}

	void verify(String token) {
		if (token == null) throw new JWTVerificationException("Token was null");
		Algorithm signingAlgorithm = Algorithm.HMAC256(SIGNING_SECRET);
		JWTVerifier verifier = JWT.require(signingAlgorithm).build();
		verifier.verify(token);
	}
}
