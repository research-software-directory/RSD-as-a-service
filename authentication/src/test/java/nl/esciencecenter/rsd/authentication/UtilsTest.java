// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.net.URI;

public class UtilsTest {

	@Test
	void givenValidWellKnownData_whenExtractingTokenEndpoint_correctResultReturned() {
		String data = """
				{
				  "token_endpoint_auth_signing_alg_values_supported": [
				    "RS256"
				  ],
				  "id_token_signing_alg_values_supported": [
				    "RS256"
				  ],
				  "userinfo_endpoint": "https://sandbox.orcid.org/oauth/userinfo",
				  "authorization_endpoint": "https://sandbox.orcid.org/oauth/authorize",
				  "token_endpoint": "https://sandbox.orcid.org/oauth/token",
				  "jwks_uri": "https://sandbox.orcid.org/oauth/jwks",
				  "claims_supported": [
				    "family_name",
				    "given_name",
				    "name",
				    "auth_time",
				    "iss",
				    "sub"
				  ],
				  "scopes_supported": [
				    "openid"
				  ],
				  "subject_types_supported": [
				    "public"
				  ],
				  "response_types_supported": [
				    "code",
				    "id_token",
				    "id_token token"
				  ],
				  "claims_parameter_supported": false,
				  "token_endpoint_auth_methods_supported": [
				    "client_secret_post"
				  ],
				  "grant_types_supported": [
				    "authorization_code",
				    "implicit",
				    "refresh_token"
				  ],
				  "issuer": "https://sandbox.orcid.org"
				}""";

		URI tokenEndpoint = Utils.extractTokenUrlFromWellKnownData(data);

		Assertions.assertEquals(URI.create("https://sandbox.orcid.org/oauth/token"), tokenEndpoint);
	}

	@Test
	void givenInvalidJson_whenExtractingTokenEndpoint_thenExceptionThrown() {
		String data = "{";

		Assertions.assertThrows(RuntimeException.class, () -> Utils.extractTokenUrlFromWellKnownData(data));
	}

	@Test
	void givenDataWithoutTokenEndpoint_whenExtractingTokenEndpoint_thenExceptionThrown() {
		String data = "{\"token_endpoint\": null}";

		Assertions.assertThrows(ClassCastException.class, () -> Utils.extractTokenUrlFromWellKnownData(data));
	}

}
