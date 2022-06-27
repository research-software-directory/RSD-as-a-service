// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.Gson;

import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class JwtCreator {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	private final String signingSecret;
	private final Algorithm signingAlgorithm;

	public JwtCreator(String signingSecret) {
		signingSecret = Objects.requireNonNull(signingSecret);
		this.signingSecret = signingSecret;
		this.signingAlgorithm = Algorithm.HMAC256(this.signingSecret);
	}

	String createUserJwt(UUID account, String name, boolean isAdmin) {
		return JWT.create()
				.withClaim("iss", "rsd_auth")
				.withClaim("role", isAdmin ? "rsd_admin" : "rsd_user")
				.withClaim("account", account.toString())
				.withClaim("name", name)
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
	}

	String createAdminJwt() {
		return JWT.create()
				.withClaim("iss", "rsd_auth")
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
				.sign(signingAlgorithm);
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
				.sign(signingAlgorithm);
	}
}
