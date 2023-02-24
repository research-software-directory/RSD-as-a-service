// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import net.minidev.json.JSONArray;

public class HelmholtzAaiLoginTest {
	@Test
	void testOrganisationFromEntitlementsExpected() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:h-df.de:group:test-vo#login-dev.helmholtz.de");
		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:HIFIS#login-dev.helmholtz.de");
		arr.add("urn:mace:dir:entitlement:common-lib-terms");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("urn:geant:helmholtz.de:group:UFZ#login-dev.helmholtz.de");
		assertTrue(
			"GFZ".equals(HelmholtzAaiLogin.getOrganisationFromEntitlements(arr))
			||
			"UFZ".equals(HelmholtzAaiLogin.getOrganisationFromEntitlements(arr))
		);

		JSONArray nohash = new JSONArray();

		nohash.add("urn:geant:helmholtz.de:group:Helmholtz-member");
		nohash.add("urn:geant:helmholtz.de:group:GFZ");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(nohash)
		);
	}

	@Test
	void testOrganisationFromEntitlementsExternalUsers() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn:mace:dir:entitlement:common-lib-terms");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(null)
		);

		JSONArray empty = new JSONArray();

		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(empty)
		);
	}

	@Test
	void testOrganisationFromEntitlementsRegex() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtzade:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn@geant@helmholtz@de@group@GFZ#login-dev.helmholtz.de");
		arr.add("GFZ#login-dev.helmholtz.de");
		arr.add("GFZ");

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);
	}

	@Test
	void testOrganisationFromEntitlementsDefaultValue() {
		JSONArray arr = new JSONArray();

		// No entitlements -> Null
		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(null)
		);

		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		// Default value should be returned if user is part of the Helmholtz
		// association but no fitting centre could be found
		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login.helmholtz.de");

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		// Unknown or new institution
		arr.add("urn:geant:helmholtz.de:group:NoRealCentre#login-dev.helmholtz.de");
		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("");
		arr.add("test");

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);

		// Actual centre does not return default value
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		assertNotEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
		);
	}
}
