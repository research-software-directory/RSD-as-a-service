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
import java.util.Random;
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

		AccountInfo fakeAccount = new AccountInfo(UUID.randomUUID(), name, true, extraDataMap, false, Optional.empty());

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

	@Test
	void givenOldToken_whenRefreshing_thenNewTokenReturned() {
		Instant now = Instant.now();

		String randomStringKey = TestingUtils.randomString();
		String randomStringValue = TestingUtils.randomString();

		String randomDoubleKey = TestingUtils.randomString();
		double randomDoubleValue = Math.random();

		String randomLongKey = TestingUtils.randomString();
		long randomLongValue = new Random().nextLong();

		String randomBooleanKey = TestingUtils.randomString();
		boolean randomBooleanValue = Math.random() < 0.5;

		String randomListKey = TestingUtils.randomString();
		List<String> randomListValue = List.of(TestingUtils.randomString(), TestingUtils.randomString());

		String randomMapKey = TestingUtils.randomString();
		Map<String, List<String>> randomMapValue = Map.of(
			TestingUtils.randomString(),
			List.of(TestingUtils.randomString()),
			TestingUtils.randomString(),
			List.of(TestingUtils.randomString(), TestingUtils.randomString(), TestingUtils.randomString())
		);

		String signingSecret = TestingUtils.randomString();
		String tokenToBeRefreshed = JWT.create()
			.withExpiresAt(now)
			.withClaim(randomStringKey, randomStringValue)
			.withClaim(randomDoubleKey, randomDoubleValue)
			.withClaim(randomLongKey, randomLongValue)
			.withClaim(randomBooleanKey, randomBooleanValue)
			.withClaim(randomListKey, randomListValue)
			.withClaim(randomMapKey, randomMapValue)
			.withClaim(JWT_ROLE_KEY, EXPECTED_ADMIN_ROLE)
			.sign(Algorithm.HMAC256(signingSecret));

		JwtCreator jwtCreator = new JwtCreator(signingSecret);
		String refreshedToken = jwtCreator.refreshToken(tokenToBeRefreshed, false);

		JWTVerifier verification = JWT.require(Algorithm.HMAC256(signingSecret)).build();

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verification.verify(refreshedToken));

		Instant expiresAt = decodedJWT.getExpiresAtAsInstant();
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).minus(LIFETIME_LEEWAY_JWT).isBefore(expiresAt));
		Assertions.assertTrue(now.plus(EXPECTED_LIFESPAN_JWT).plus(LIFETIME_LEEWAY_JWT).isAfter(expiresAt));

		Assertions.assertEquals(EXPECTED_USER_ROLE, decodedJWT.getClaim(JWT_ROLE_KEY).asString());

		Assertions.assertEquals(randomStringValue, decodedJWT.getClaim(randomStringKey).asString());
		Assertions.assertEquals(randomDoubleValue, decodedJWT.getClaim(randomDoubleKey).asDouble());
		Assertions.assertEquals(randomLongValue, decodedJWT.getClaim(randomLongKey).asLong());
		Assertions.assertEquals(randomBooleanValue, decodedJWT.getClaim(randomBooleanKey).asBoolean());
		Assertions.assertEquals(randomListValue, decodedJWT.getClaim(randomListKey).asList(String.class));
		Assertions.assertEquals(randomMapValue, decodedJWT.getClaim(randomMapKey).asMap());
	}
}
