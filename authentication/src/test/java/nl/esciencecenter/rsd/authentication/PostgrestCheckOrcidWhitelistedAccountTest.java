// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class PostgrestCheckOrcidWhitelistedAccountTest {

	@Test
	void givenCorrectJsonResponseAndWhitelistedOrcid_whenCheckingWhiteList_thenCheckPasses() {
		String validJsonResponse = "[{\"orcid\": \"0000-0000-1234-5678\"}]";
		String orcid = "0000-0000-1234-5678";

		boolean isWhitelisted = PostgrestCheckOrcidWhitelistedAccount.orcidInResponse(orcid, validJsonResponse);

		Assertions.assertTrue(isWhitelisted);
	}

	@Test
	void givenValidJsonResponseWithoutTestedOrcidAndWhitelistedOrcid_whenCheckingWhiteList_thenCheckFails() {
		String validJsonResponseWithoutTestedOrcid = "[{\"orcid\": \"0000-0000-0000-000\"}]";
		String orcid = "0000-0000-1234-5678";

		boolean isWhitelisted = PostgrestCheckOrcidWhitelistedAccount.orcidInResponse(orcid, validJsonResponseWithoutTestedOrcid);

		Assertions.assertFalse(isWhitelisted);
	}

	@Test
	void givenEmptyJsonResponseAndWhitelistedOrcid_whenCheckingWhiteList_thenCheckFails() {
		String emptyJsonResponse = "[]";
		String orcid = "0000-0000-1234-5678";

		boolean isWhitelisted = PostgrestCheckOrcidWhitelistedAccount.orcidInResponse(orcid, emptyJsonResponse);

		Assertions.assertFalse(isWhitelisted);
	}

	@Test
	void givenTooLargeJsonResponseAndWhitelistedOrcid_whenCheckingWhiteList_thenCheckFails() {
		String tooLargeJsonResponse = "[{\"orcid\": \"0000-0000-1234-5678\"}, {\"orcid\": \"0000-1234-1234-5678\"}]";
		String orcid = "0000-0000-1234-5678";

		boolean isWhitelisted = PostgrestCheckOrcidWhitelistedAccount.orcidInResponse(orcid, tooLargeJsonResponse);

		Assertions.assertFalse(isWhitelisted);
	}

	@Test
	void givenInvalidJsonResponseAndWhitelistedOrcid_whenCheckingWhiteList_thenExceptionThrown() {
		String tooLargeJsonResponse = "[";
		String orcid = "0000-0000-1234-5678";

		Assertions.assertThrows(RuntimeException.class, () -> PostgrestCheckOrcidWhitelistedAccount.orcidInResponse(orcid, tooLargeJsonResponse));
	}
}
