// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

import java.util.Objects;

public class JwtVerifier {

	private final String signingSecret;

	public JwtVerifier(String signingSecret) {
		this.signingSecret = Objects.requireNonNull(signingSecret);
	}

	void verify(String token) {
		if (token == null) throw new JWTVerificationException("Token was null");
		Algorithm signingAlgorithm = Algorithm.HMAC256(signingSecret);
		JWTVerifier verifier = JWT.require(signingAlgorithm).build();
		verifier.verify(token);
	}
}
