// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class JwtCreator {

	private static final Duration JWT_LIFESPAN = Duration.ofHours(1);
	private static final Duration JWT_ACCESS_TOKEN_LIFESPAN = Duration.ofMinutes(15);

	private static final String JWT_ROLE_KEY = "role";
	static final String JWT_ACCOUNT_KEY = "account";
	private static final String JWT_NAME_KEY = "name";
	private static final String JWT_DATA_KEY = "data";
	private static final String RSD_ADMIN_ROLE = "rsd_admin";
	private static final String RSD_USER_ROLE = "rsd_user";
	private static final String RSD_AUTH_ROLE = "rsd_auth";

	private final Algorithm signingAlgorithm;

	public JwtCreator(String signingSecret) {
		Objects.requireNonNull(signingSecret);
		this.signingAlgorithm = Algorithm.HMAC256(signingSecret);
	}

	/**
	 * Create a JWT that should be returned to the user (by the means of an HTTP cookie).
	 *
	 * @param accountInfo the user account for which to create the JWT
	 * @return the JWT for the user
	 */
	String createUserJwt(AccountInfo accountInfo) {
		return JWT.create()
			.withIssuer(RSD_AUTH_ROLE)
			.withClaim(JWT_ROLE_KEY, accountInfo.isAdmin() ? RSD_ADMIN_ROLE : RSD_USER_ROLE)
			.withClaim(JWT_ACCOUNT_KEY, accountInfo.account().toString())
			.withClaim(JWT_NAME_KEY, accountInfo.name())
			.withClaim(JWT_DATA_KEY, accountInfo.data())
			.withExpiresAt(Instant.now().plus(JWT_LIFESPAN))
			.sign(signingAlgorithm);
	}

	/**
	 * Create a JWT that should be used by this module to make admin requests to PostgREST.
	 * The JWT should never be returned to the user
	 *
	 * @return an admin JWT for internal usage only
	 */
	public String createAnonymousAdminJwt() {
		return JWT.create()
			.withIssuer(RSD_AUTH_ROLE)
			.withClaim(JWT_ROLE_KEY, RSD_ADMIN_ROLE)
			.withExpiresAt(Instant.now().plus(JWT_LIFESPAN))
			.sign(signingAlgorithm);
	}

	/**
	 * Create a JWT that is used to proxy the request of the user, who should have a valid access token,
	 * to PostgREST. The JWT should not be returned to the user.
	 *
	 * @param accountID the user's account ID
	 * @param tokenID the ID of the access token
	 * @return a non-admin JWT that is used for proxying the user's request to PostgREST
	 */
	public String createAccessTokenJwt(String accountID, String tokenID) {
		return JWT.create()
			.withIssuer(RSD_AUTH_ROLE)
			.withClaim(JWT_ROLE_KEY, RSD_USER_ROLE)
			.withClaim(JWT_ACCOUNT_KEY, accountID)
			.withClaim("type", "access_token_" + (tokenID != null ? tokenID : ""))
			.withExpiresAt(Instant.now().plus(JWT_ACCESS_TOKEN_LIFESPAN))
			.sign(signingAlgorithm);
	}

	/**
	 * Generate a new token with the same payload as the old token, updating the expiry date and role.
	 * This method does <strong>not</strong> verify the old token.
	 *
	 * @param oldToken the JWT to refresh
	 * @param isCurrentlyAdmin a flag to indicate if the user is currently an admin
	 * @return a refreshed token
	 */
	String refreshToken(String oldToken, boolean isCurrentlyAdmin) {
		DecodedJWT oldJwt = JWT.decode(oldToken);
		Map<String, Claim> oldClaims = oldJwt.getClaims();
		JWTCreator.Builder builder = JWT.create();
		Map<String, Object> oldClaimsCopy = new HashMap<>();
		for (Map.Entry<String, Claim> claimEntry : oldClaims.entrySet()) {
			oldClaimsCopy.put(claimEntry.getKey(), claimEntry.getValue().as(Object.class));
		}

		return builder
			.withPayload(oldClaimsCopy)
			.withClaim(JWT_ROLE_KEY, isCurrentlyAdmin ? RSD_ADMIN_ROLE : RSD_USER_ROLE)
			.withExpiresAt(Instant.now().plus(JWT_LIFESPAN))
			.sign(signingAlgorithm);
	}
}
