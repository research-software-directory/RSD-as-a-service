// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.AfterAll;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

public class MainTest {
	OpenIdInfo userinfo = new OpenIdInfo(
		"12345", "User Name", "user@example.com", "Example User"
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
}
