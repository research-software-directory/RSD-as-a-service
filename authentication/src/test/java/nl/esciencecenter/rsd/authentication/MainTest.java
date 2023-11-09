// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrowsExactly;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MainTest {
	OpenIdInfo userinfo = new OpenIdInfo(
			"12345", "User Name", "user@example.com", "Example User"
	);
	OpenIdInfo userinfoNullOrganisation = new OpenIdInfo(
			"12345", "User Name", "user@example.com", null
	);
	static MockedStatic<Config> utilities;

	@BeforeAll
	public static void init() {
		utilities = Mockito.mockStatic(Config.class);
	}

	@AfterAll
	public static void cleanup() {
		utilities.close();
	}

	@Test
	void testUserIsAllowedEmptyWhitelist() {
		utilities.when(Config::userMailWhitelist).thenReturn(null);
		assertTrue(Main.userIsAllowed(userinfo));
	}

	@Test
	void testUserIsAllowedEmptyStringWhitelist() {
		utilities.when(Config::userMailWhitelist).thenReturn("");
		assertTrue(Main.userIsAllowed(userinfo));
	}

	@Test
	void testUserIsAllowedWhitelistIsAllowed() {
		utilities.when(Config::userMailWhitelist).thenReturn(
				"user@example.com;test@example.com;example@example.com"
		);
		assertTrue(Main.userIsAllowed(userinfo));
	}

	@Test
	void testUserIsAllowedWhitelistIsNotAllowed() {
		utilities.when(Config::userMailWhitelist).thenReturn(
				"test@example.com;example@example.com"
		);
		assertFalse(Main.userIsAllowed(userinfo));
	}

	@Test
	void testAaiAllowListDisabled() {
		utilities.when(Config::helmholtzAaiUseAllowList).thenReturn(false);
		assertFalse(Main.aaiUserIsAllowed(userinfoNullOrganisation));
		assertTrue(Main.aaiUserIsAllowed(userinfo));
	}

	@Test
	void testAaiAllowListEnabled() {
		utilities.when(Config::helmholtzAaiUseAllowList).thenReturn(true);
		utilities.when(Config::helmholtzAaiAllowList).thenReturn(null);
		assertThrowsExactly(
				RsdAuthenticationException.class,
				() -> Main.aaiUserIsAllowed(userinfoNullOrganisation),
				"Your email address (user@example.com) is not in the allow list."
		);
		utilities.when(Config::helmholtzAaiAllowList).thenReturn("user@example.com");
		assertTrue(Main.aaiUserIsAllowed(userinfoNullOrganisation));
		assertTrue(Main.aaiUserIsAllowed(userinfo));
	}
}
