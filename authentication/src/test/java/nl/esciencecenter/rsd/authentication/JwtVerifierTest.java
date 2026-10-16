// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.AlgorithmMismatchException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.time.Duration;
import java.time.Instant;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class JwtVerifierTest {

	@Test
	void givenValidJwt_whenVerifying_thenDecodedJwtReturned() {
		String randomStringKey = TestingUtils.randomString();
		String randomStringValue = TestingUtils.randomString();

		String signingSecret = TestingUtils.randomString();
		String validJwt = JWT.create()
			.withExpiresAt(Instant.now().plus(Duration.ofMinutes(1)))
			.withClaim(randomStringKey, randomStringValue)
			.sign(Algorithm.HMAC256(signingSecret));

		JwtVerifier verifier = new JwtVerifier(signingSecret);

		DecodedJWT decodedJWT = Assertions.assertDoesNotThrow(() -> verifier.verify(validJwt));

		Assertions.assertEquals(randomStringValue, decodedJWT.getClaim(randomStringKey).asString());
	}

	@Test
	void givenJwtWithTemperedSignature_whenVerifying_thenExceptionThrown() {
		String randomStringKey = TestingUtils.randomString();
		String randomStringValue = TestingUtils.randomString();

		String signingSecret = TestingUtils.randomString();
		String validJwt = JWT.create()
			.withExpiresAt(Instant.now().plus(Duration.ofMinutes(1)))
			.withClaim(randomStringKey, randomStringValue)
			.sign(Algorithm.HMAC256(signingSecret));

		char[] charsOfToken = validJwt.toCharArray();
		int signatureStartIdx = -1;
		for (int i = charsOfToken.length - 1; i >= 0; --i) {
			if (charsOfToken[i] == '.') {
				signatureStartIdx = i + 1;
				break;
			}
		}

		// change a letter into a digit or vice versa to temper the signature
		charsOfToken[signatureStartIdx] = Character.isDigit(charsOfToken[signatureStartIdx]) ? 'a' : '0';
		String temperedToken = new String(charsOfToken);

		JwtVerifier verifier = new JwtVerifier(signingSecret);

		Assertions.assertThrowsExactly(SignatureVerificationException.class, () -> verifier.verify(temperedToken));
	}

	@Test
	void givenExpiredJwt_whenVerifying_thenExceptionThrown() {
		String randomStringKey = TestingUtils.randomString();
		String randomStringValue = TestingUtils.randomString();

		String signingSecret = TestingUtils.randomString();
		String expiredJwt = JWT.create()
			.withExpiresAt(Instant.now().minus(Duration.ofMinutes(1)))
			.withClaim(randomStringKey, randomStringValue)
			.sign(Algorithm.HMAC256(signingSecret));

		JwtVerifier verifier = new JwtVerifier(signingSecret);

		Assertions.assertThrowsExactly(TokenExpiredException.class, () -> verifier.verify(expiredJwt));
	}

	@Test
	void givenJwtWithNoneEncryptionAlgorithm_whenVerifying_thenExceptionThrown() {
		String randomStringKey = TestingUtils.randomString();
		String randomStringValue = TestingUtils.randomString();

		String noneJwt = JWT.create()
			.withExpiresAt(Instant.now().plus(Duration.ofMinutes(1)))
			.withClaim(randomStringKey, randomStringValue)
			.sign(Algorithm.none());

		String signingSecret = TestingUtils.randomString();
		JwtVerifier verifier = new JwtVerifier(signingSecret);

		Assertions.assertThrowsExactly(AlgorithmMismatchException.class, () -> verifier.verify(noneJwt));
	}

	@Test
	void givenNull_whenVerifying_thenExceptionThrown() {
		String signingSecret = TestingUtils.randomString();
		JwtVerifier verifier = new JwtVerifier(signingSecret);

		Assertions.assertThrowsExactly(JWTVerificationException.class, () -> verifier.verify(null));
	}
}
