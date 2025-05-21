// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class QueryParameterBuilderTest {

	@Test
	void givenNoKeyValuePairs_whenCallingToString_thenQuestionMarkReturned() {
		QueryParameterBuilder queryParameterBuilder = new QueryParameterBuilder();

		Assertions.assertEquals("?", queryParameterBuilder.toString());
	}

	@ParameterizedTest
	@CsvSource({
		"key,value,?key=value",
		"123,456,?123=456",
		"scope,openid profile email,?scope=openid+profile+email",
		"url,https://www.example.com,?url=https%3A%2F%2Fwww.example.com",
		"a?b&c,d&e?f=g,?a%3Fb%26c=d%26e%3Ff%3Dg",
	})
	void givenKeyValuePairs_whenBuildingAndCallingToString_thenCorrectOutputProduced(String key, String value, String expected) {
		QueryParameterBuilder queryParameterBuilder = new QueryParameterBuilder();

		queryParameterBuilder.addQueryParameter(key, value);

		Assertions.assertEquals(expected, queryParameterBuilder.toString());
	}

	@Test
	void givenMultipleKeyValuePairs_whenBuildingAndCallingToString_thenCorrectOutputProduced() {
		QueryParameterBuilder queryParameterBuilder = new QueryParameterBuilder();

		queryParameterBuilder.addQueryParameter("key", "value")
			.addQueryParameter("123", "456")
			.addQueryParameter("url", "https://www.example.com");

		Assertions.assertEquals("?key=value&123=456&url=https%3A%2F%2Fwww.example.com", queryParameterBuilder.toString());
	}
}
