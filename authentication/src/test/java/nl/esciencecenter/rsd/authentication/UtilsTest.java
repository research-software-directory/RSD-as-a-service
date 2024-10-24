// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

class UtilsTest {

	@Test
	void givenValidWellKnownData_whenExtractingTokenEndpoint_correctResultReturned() {
		// editorconfig-checker-disable
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
		// editorconfig-checker-enable

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

	@Test
	void givenFormMap_whenConvertingToxWwwFormUrlencoded_thenCorrectResultReturned() {
		Map<String, String> emptyForm = Map.of();
		Assertions.assertEquals("", Utils.formMapToxWwwFormUrlencoded(emptyForm));

		Map<String, String> singleEntryForm = Map.of("abc", "def");
		Assertions.assertEquals("abc=def", Utils.formMapToxWwwFormUrlencoded(singleEntryForm));

		// using a LinkedHashMap to ensure iteration order is insertion order
		Map<String, String> multiEntryForm = new LinkedHashMap<>();
		multiEntryForm.put("abc", "def");
		multiEntryForm.put("123", "456");
		Assertions.assertEquals("abc=def&123=456", Utils.formMapToxWwwFormUrlencoded(multiEntryForm));
		multiEntryForm.put("key", "value");
		Assertions.assertEquals("abc=def&123=456&key=value", Utils.formMapToxWwwFormUrlencoded(multiEntryForm));
	}

	@Test
	void givenUriAndForm_whenConvertingToHttpRequest_thenCorrectResultReturned() {
		URI uri = URI.create("https://www.example.com");
		Map<String, String> form = Map.of("abc", "defgh");

		HttpRequest request = Utils.formToHttpRequest(uri, form);

		Assertions.assertEquals(uri, request.uri());
		Assertions.assertEquals("POST", request.method());
		HttpHeaders headers = request.headers();
		List<String> contentTypeHeader = headers.allValues("Content-Type");
		Assertions.assertEquals(1, contentTypeHeader.size());
		Assertions.assertEquals("application/x-www-form-urlencoded", contentTypeHeader.getFirst());
		int contentLength = Utils.formMapToxWwwFormUrlencoded(form).length();
		Assertions.assertEquals(contentLength, request.bodyPublisher().orElseThrow().contentLength());
	}
}
