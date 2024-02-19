// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import net.minidev.json.JSONArray;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HelmholtzIdLoginTest {
	@Test
	void testOrganisationFromEntitlementsExpected() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:h-df.de:group:test-vo#login-dev.helmholtz.de");
		assertNull(
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:HIFIS#login-dev.helmholtz.de");
		arr.add("urn:mace:dir:entitlement:common-lib-terms");

		assertEquals(
				"GFZ",
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("urn:geant:helmholtz.de:group:UFZ#login-dev.helmholtz.de");
		assertTrue(
				"GFZ".equals(HelmholtzIdLogin.getOrganisationFromEntitlements(arr))
						||
						"UFZ".equals(HelmholtzIdLogin.getOrganisationFromEntitlements(arr))
		);

		JSONArray nohash = new JSONArray();

		nohash.add("urn:geant:helmholtz.de:group:Helmholtz-member");
		nohash.add("urn:geant:helmholtz.de:group:GFZ");

		assertEquals(
				"GFZ",
				HelmholtzIdLogin.getOrganisationFromEntitlements(nohash)
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
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		assertNull(
				HelmholtzIdLogin.getOrganisationFromEntitlements(null)
		);

		JSONArray empty = new JSONArray();

		assertNull(
				HelmholtzIdLogin.getOrganisationFromEntitlements(empty)
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
				HelmholtzIdLogin.DEFAULT_ORGANISATION,
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);
	}

	@Test
	void testOrganisationFromEntitlementsDefaultValue() {
		JSONArray arr = new JSONArray();

		// No entitlements -> Null
		assertNull(
				HelmholtzIdLogin.getOrganisationFromEntitlements(null)
		);

		assertNull(
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		// Default value should be returned if user is part of the Helmholtz
		// association but no fitting centre could be found
		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login.helmholtz.de");

		assertEquals(
				HelmholtzIdLogin.DEFAULT_ORGANISATION,
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		// Unknown or new institution
		arr.add("urn:geant:helmholtz.de:group:NoRealCentre#login-dev.helmholtz.de");
		assertEquals(
				HelmholtzIdLogin.DEFAULT_ORGANISATION,
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		arr.add("");
		arr.add("test");

		assertEquals(
				HelmholtzIdLogin.DEFAULT_ORGANISATION,
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);

		// Actual centre does not return default value
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		assertNotEquals(
				HelmholtzIdLogin.DEFAULT_ORGANISATION,
				HelmholtzIdLogin.getOrganisationFromEntitlements(arr)
		);
	}
}
