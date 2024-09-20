// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
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

import java.util.Collections;
import java.util.List;
import java.util.Map;

class MainTest {
	Map<String, List<String>> emptyData = Collections.emptyMap();
	OpenIdInfo userinfo = new OpenIdInfo(
			"12345", "User Name", "user@example.com", "Example User", emptyData
	);
	OpenIdInfo userinfoNullOrganisation = new OpenIdInfo(
			"12345", "User Name", "user@example.com", null, emptyData
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
	void testIdAllowListDisabled() {
		utilities.when(Config::helmholtzIdUseAllowList).thenReturn(false);
		assertFalse(Main.idUserIsAllowed(userinfoNullOrganisation));
		assertTrue(Main.idUserIsAllowed(userinfo));
	}

	@Test
	void testIdAllowListEnabled() {
		utilities.when(Config::helmholtzIdUseAllowList).thenReturn(true);
		utilities.when(Config::helmholtzIdAllowList).thenReturn(null);
		assertThrowsExactly(
				RsdAuthenticationException.class,
				() -> Main.idUserIsAllowed(userinfoNullOrganisation),
				"Your email address (user@example.com) is not in the allow list."
		);
		utilities.when(Config::helmholtzIdAllowList).thenReturn("user@example.com");
		assertTrue(Main.idUserIsAllowed(userinfoNullOrganisation));
		assertTrue(Main.idUserIsAllowed(userinfo));
	}
}
