// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class JwtCreatorTest {

	private static final String EXPECTED_ISSUER = "rsd_auth";
	private static final Duration EXPECTED_LIFESPAN_JWT = Duration.ofHours(1);
	private static final Duration EXPECTED_LIFESPAN_ACCESS_TOKEN_JWT = Duration.ofMinutes(15);
	private static final Duration LIFETIME_LEEWAY_JWT = Duration.ofSeconds(5);
	private static final String EXPECTED_ADMIN_ROLE = "rsd_admin";
	private static final String EXPECTED_USER_ROLE = "rsd_user";
	private static final String JWT_ROLE_KEY = "role";
	private static final String JWT_ACCOUNT_KEY = "account";
	private static final String JWT_NAME_KEY = "name";
	private static final String JWT_DATA_KEY = "data";

	@Test
	void givenRegularUserData_whenCreatingJwt_thenJwtReturned() {
		String name = "First Last";
		Map<String, List<String>> extraDataMap = Map.of("a", List.of("b"), "c", List.of("d", "e"));

		AccountInfo fakeAccount = new AccountInfo(
			UUID.randomUUID(),
			name,
			false,
			extraDataMap,
			false,
			Optional.empty()
		);

		String signingSecret = TestingUtils.randomString();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);

		String token = jwtCreator.createUserJwt(fakeAccount);
		JWTVerifier verification = JWT.require(Algorithm.HMAC256(signingSecret))
			.withIssuer(EXPECTED_ISSUER)
			.withClaim(JWT_ROLE_KEY, EXPECTED_USER_ROLE)
			.withClaim(JWT_ACCOUNT_KEY, fakeAccount.account().toString())
			.withClaim(JWT_NAME_KEY, name)
			.build();

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verification.verify(token));

		Instant expiresAt = decodedJWT.getExpiresAtAsInstant();
		Instant now = Instant.now();
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).minus(LIFETIME_LEEWAY_JWT).isBefore(expiresAt));
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).plus(LIFETIME_LEEWAY_JWT).isAfter(expiresAt));

		Map<String, Object> decodedExtraDataMap = decodedJWT.getClaim(JWT_DATA_KEY).asMap();
		Assertions.assertEquals(extraDataMap, decodedExtraDataMap);
	}

	@Test
	void givenAdminUserData_whenCreatingJwt_thenJwtReturned() {
		String name = "First Last";

		Map<String, List<String>> extraDataMap = Map.of("a", List.of("b"), "c", List.of("d", "e"));

		AccountInfo fakeAccount = new AccountInfo(
			UUID.randomUUID(),
			name,
			true,
			extraDataMap,
			false,
			Optional.empty()
		);

		String signingSecret = TestingUtils.randomString();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);

		String token = jwtCreator.createUserJwt(fakeAccount);
		JWTVerifier verification = JWT.require(Algorithm.HMAC256(signingSecret))
			.withIssuer(EXPECTED_ISSUER)
			.withClaim(JWT_ROLE_KEY, EXPECTED_ADMIN_ROLE)
			.withClaim(JWT_ACCOUNT_KEY, fakeAccount.account().toString())
			.withClaim(JWT_NAME_KEY, name)
			.build();

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verification.verify(token));

		Instant expiresAt = decodedJWT.getExpiresAtAsInstant();
		Instant now = Instant.now();
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).minus(LIFETIME_LEEWAY_JWT).isBefore(expiresAt));
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).plus(LIFETIME_LEEWAY_JWT).isAfter(expiresAt));

		Map<String, Object> decodedExtraDataMap = decodedJWT.getClaim(JWT_DATA_KEY).asMap();
		Assertions.assertEquals(extraDataMap, decodedExtraDataMap);
	}

	@Test
	void whenCreatingAnonymousAdminJwt_thenJwtReturned() {
		String signingSecret = TestingUtils.randomString();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);

		String token = jwtCreator.createAnonymousAdminJwt();
		JWTVerifier verification = JWT.require(Algorithm.HMAC256(signingSecret))
			.withIssuer(EXPECTED_ISSUER)
			.withClaim(JWT_ROLE_KEY, EXPECTED_ADMIN_ROLE)
			.build();

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verification.verify(token));
		Instant expiresAt = decodedJWT.getExpiresAtAsInstant();
		Instant now = Instant.now();
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).minus(LIFETIME_LEEWAY_JWT).isBefore(expiresAt));
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).plus(LIFETIME_LEEWAY_JWT).isAfter(expiresAt));
	}

	@Test
	void givenAccountId_whenCreatingAccessTokenJwt_thenJwtReturned() {
		UUID accountId = UUID.randomUUID();
		UUID accessTokenId = UUID.randomUUID();
		String signingSecret = TestingUtils.randomString();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);

		String token = jwtCreator.createAccessTokenJwt(accountId.toString(), accessTokenId.toString());
		JWTVerifier verification = JWT.require(Algorithm.HMAC256(signingSecret))
			.withIssuer(EXPECTED_ISSUER)
			.withClaim(JWT_ROLE_KEY, EXPECTED_USER_ROLE)
			.withClaim(JWT_ACCOUNT_KEY, accountId.toString())
			.build();

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verification.verify(token));
		Instant expiresAt = decodedJWT.getExpiresAtAsInstant();
		Instant now = Instant.now();
		Assertions.assertTrue(
			now.plus(EXPECTED_LIFESPAN_ACCESS_TOKEN_JWT).minus(LIFETIME_LEEWAY_JWT).isBefore(expiresAt)
		);
		Assertions.assertTrue(
			now.plus(EXPECTED_LIFESPAN_ACCESS_TOKEN_JWT).plus(LIFETIME_LEEWAY_JWT).isAfter(expiresAt)
		);
	}
}
