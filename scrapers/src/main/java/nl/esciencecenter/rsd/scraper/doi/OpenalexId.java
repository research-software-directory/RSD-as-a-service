// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Utils;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// https://docs.openalex.org/how-to-use-the-api/get-single-entities#the-openalex-id
public class OpenalexId {

	private static final Pattern OPENALEX_PATTERN = Pattern.compile("^https://openalex\\.org/([WwAaSsIiCcPpFf]\\d{3,13})$");
	private static final String OPENALEX_ID_BASE = "https://openalex.org/";

	private final String openalexKey;

	private OpenalexId(String openalexString) {
		this.openalexKey = openalexString.toUpperCase(Locale.ROOT);
	}

	public static boolean isValid(String idToTest) {
		return idToTest != null && OPENALEX_PATTERN.asPredicate().test(idToTest);
	}

	public static OpenalexId fromString(String id) {
		if (id == null) {
			throw new IllegalArgumentException("The ID cannot be null");
		}
		Matcher matcher = OPENALEX_PATTERN.matcher(id);

		if (!matcher.find()) {
			throw new IllegalArgumentException("This is an invalid OpenAlex ID");
		}

		String key = matcher.group(1);
		return new OpenalexId(key);
	}

	public String toUrlEncodedString() {
		return Utils.urlEncode(toString());
	}

	public String getOpenalexKey() {
		return openalexKey;
	}

	@Override
	public String toString() {
		return OPENALEX_ID_BASE + openalexKey;
	}

	@Override
	public int hashCode() {
		return openalexKey.hashCode();
	}

	@Override
	public boolean equals(Object other) {
		if (other == null) {
			return false;
		}
		if (this == other) {
			return true;
		}
		if (other instanceof OpenalexId otherOpenalexId) {
			return openalexKey.equals(otherOpenalexId.openalexKey);
		}

		return false;
	}
}
