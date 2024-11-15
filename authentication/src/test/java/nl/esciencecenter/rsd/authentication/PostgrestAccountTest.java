// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

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
}
