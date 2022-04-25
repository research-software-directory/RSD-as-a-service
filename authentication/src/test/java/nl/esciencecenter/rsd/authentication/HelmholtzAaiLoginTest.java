package nl.esciencecenter.rsd.authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import net.minidev.json.JSONArray;

public class HelmholtzAaiLoginTest {
	@Test
	void testOrganisationFromEntitlementsExpected() {
		JSONArray arr = new JSONArray();

		arr.add("urn:geant:h-df.de:group:test-vo#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:Helmholtz-member#login-dev.helmholtz.de");
		arr.add("urn:geant:helmholtz.de:group:GFZ#login-dev.helmholtz.de");
		arr.add("urn:mace:dir:entitlement:common-lib-terms");

		assertEquals(
			"GFZ",
			HelmholtzAaiLogin.getOrganisationFromEntitlements(arr)
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

		assertEquals(
			HelmholtzAaiLogin.DEFAULT_ORGANISATION,
			HelmholtzAaiLogin.getOrganisationFromEntitlements(null)
		);
	}
}
