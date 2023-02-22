// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import net.minidev.json.JSONArray;

public class HelmholtzAaiLoginTest {
	@Test
	void testOrganisationFromEntitlementsExpected() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:h-df.de:group:test-vo#login-dev.helmholtz.de");
		assertEquals(
			"Unknown",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, true)
		);

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:HIFIS#login-dev.helmholtz.de");
		arr.add("urn:mace:dir:entitlement:common-lib-terms");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, false)
		);

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, true)
		);

		arr.add("urn:geant:helmholtz.de:group:UFZ#login-dev.helmholtz.de");
		assertTrue(
			"GFZ".equals(HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, false))
			||
			"UFZ".equals(HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, false))
		);

		JSONArray nohash = new JSONArray();

		nohash.add("urn:geant:helmholtz.de:group:Helmholtz-member");
		nohash.add("urn:geant:helmholtz.de:group:GFZ");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(nohash, false)
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
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, true)
		);

		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(null, false)
		);

		JSONArray empty = new JSONArray();

		assertNull(
			HelmholtzAaiLogin.getOrganisationFromEntitlements(empty, false)
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
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, false)
		);
	}

	@Test
	void testOrganisationFromEntitlementsDefaultValue() {
		JSONArray arr = new JSONArray();

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, true)
		);

		arr.add("");
		arr.add("test");

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, true)
		);

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(null, true)
		);

		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr, false)
		);
	}
}
