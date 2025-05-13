// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.ZonedDateTime;
import java.util.UUID;

class PostgrestAccountTest {

	@Test
	void givenEmtpyArray_whenCheckingIfAdmin_thenFalseReturned() {
		String emptyArray = "[]";
		UUID adminUuid = UUID.randomUUID();

		Assertions.assertFalse(PostgrestAccount.parseIsAdminResponse(adminUuid, emptyArray));
	}

	@Test
	void givenResponseWithNullValue_whenCheckingIfAdmin_thenFalseReturned() {
		String emptyArray = "[{\"account_id\": null}]";
		UUID adminUuid = UUID.randomUUID();

		Assertions.assertFalse(PostgrestAccount.parseIsAdminResponse(adminUuid, emptyArray));
	}

	@Test
	void givenArrayOfSizeOneWithCorrectUuid_whenCheckingIfAdmin_thenTrueReturned() {
		UUID adminUuid = UUID.randomUUID();
		String successResponse = "[{\"account_id\": \"%s\"}]".formatted(adminUuid);

		Assertions.assertTrue(PostgrestAccount.parseIsAdminResponse(adminUuid, successResponse));
	}

	@Test
	void givenArrayOfSizeOneWithIncorrectUuid_whenCheckingIfAdmin_thenFalseReturned() {
		UUID adminUuid = UUID.randomUUID();
		String successResponse = "[{\"account_id\": \"%s\"}]".formatted(UUID.randomUUID());

		Assertions.assertFalse(PostgrestAccount.parseIsAdminResponse(adminUuid, successResponse));
	}

	@Test
	void givenArrayOfSizeTwoWithCorrectUuid_whenCheckingIfAdmin_thenFalseReturned() {
		UUID adminUuid = UUID.randomUUID();
		String wrongIdResponse = "[{\"account_id\": \"%s\"}, {\"account_id\": \"%s\"}]".formatted(adminUuid, UUID.randomUUID());

		Assertions.assertFalse(PostgrestAccount.parseIsAdminResponse(adminUuid, wrongIdResponse));
	}

	private String formatInviteResponse(Integer usesLeft, ZonedDateTime expiresAt) {
		return "[{\"uses_left\": %s, \"expires_at\": \"%s\"}]".formatted(usesLeft, expiresAt);
	}

	@Test
	void givenEmptyInviteResponse_whenParsed_thenExceptionThrown() {
		String json = "[]";

		Assertions.assertThrowsExactly(RsdAccountInviteException.class, () -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
	}

	@Test
	void givenValidInviteResponseWithFiniteUses_whenParsed_thenUsesLeftReturned() {
		int expectedUsesLeft = 1;
		String json = formatInviteResponse(expectedUsesLeft, ZonedDateTime.now().plusMinutes(1));

		int actualUsesLeft = Assertions.assertDoesNotThrow(() -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
		Assertions.assertEquals(expectedUsesLeft, actualUsesLeft);
	}

	@Test
	void givenValidInviteResponseWithInfiniteUses_whenParsed_thenNullReturned() {
		String json = formatInviteResponse(null, ZonedDateTime.now().plusMinutes(1));

		Integer actualUsesLeft = Assertions.assertDoesNotThrow(() -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
		Assertions.assertNull(actualUsesLeft);
	}

	@Test
	void givenInviteResponseWithZeroUses_whenParsed_thenExceptionThrown() {
		String json = formatInviteResponse(0, ZonedDateTime.now().plusMinutes(1));

		Assertions.assertThrowsExactly(RsdAccountInviteException.class, () -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
	}

	@Test
	void givenInviteResponseWithNegativeUses_whenParsed_thenExceptionThrown() {
		String json = formatInviteResponse(-1, ZonedDateTime.now().plusMinutes(1));

		Assertions.assertThrowsExactly(RsdAccountInviteException.class, () -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
	}

	@Test
	void givenInviteResponseExpired_whenParsed_thenExceptionThrown() {
		String json = formatInviteResponse(1, ZonedDateTime.now().minusMinutes(1));

		Assertions.assertThrowsExactly(RsdAccountInviteException.class, () -> PostgrestAccount.checkInviteResponseGetUsesLeft(UUID.randomUUID(), json));
	}
}
