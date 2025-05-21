// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.StringJoiner;

public class QueryParameterBuilder {

	private final StringJoiner queryBuilder = new StringJoiner("&", "?", "");

	public QueryParameterBuilder addQueryParameter(String key, String value) {
		String keyEscaped = URLEncoder.encode(key, StandardCharsets.UTF_8);
		String valueEscaped = URLEncoder.encode(key, StandardCharsets.UTF_8);
		queryBuilder.add(keyEscaped + "=" + valueEscaped);

		return this;
	}

	@Override
	public String toString() {
		return queryBuilder.toString();
	}
}
