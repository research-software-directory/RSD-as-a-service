// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.StringJoiner;

/**
 * This class builds a query parameter string, consisting of multiple key-value pairs of the form <code>key=value</code>,
 * separated by the <code>&</code> character.
 * Keys and values are both URL escaped.
 * The resulting string is prepended with the <code>?</code> character.
 */
public class QueryParameterBuilder {

	private final StringJoiner queryBuilder = new StringJoiner("&", "?", "");

	/**
	 * @param key   The key of the query parameter, as in <code>key=value</code>.
	 * @param value the value of the query parameter, as in <code>key=value</code>.
	 * @return This {@link QueryParameterBuilder}, so it can be used as in the builder pattern.
	 */
	public QueryParameterBuilder addQueryParameter(String key, String value) {
		String keyEscaped = URLEncoder.encode(key, StandardCharsets.UTF_8);
		String valueEscaped = URLEncoder.encode(value, StandardCharsets.UTF_8);
		queryBuilder.add(keyEscaped + "=" + valueEscaped);

		return this;
	}

	@Override
	public String toString() {
		return queryBuilder.toString();
	}
}
