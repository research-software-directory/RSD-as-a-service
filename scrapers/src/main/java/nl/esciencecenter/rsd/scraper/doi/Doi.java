// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import nl.esciencecenter.rsd.scraper.Utils;

import java.util.Locale;
import java.util.regex.Pattern;

public class Doi {

	private static final Pattern DOI_PATTERN = Pattern.compile("^10(\\.\\w+)+/\\S+$");

	private final String doiString;

	private Doi(String doiString) {
		this.doiString = doiString.toLowerCase(Locale.ROOT);
	}

	public static boolean isValid(String doiToTest) {
		return doiToTest != null && doiToTest.length() <= 255 && DOI_PATTERN.asPredicate().test(doiToTest);
	}

	public static Doi fromString(String doi) {
		if (isValid(doi)) {
			return new Doi(doi);
		} else {
			throw new IllegalArgumentException();
		}
	}

	public String toUrlEncodedString() {
		return Utils.urlEncode(doiString);
	}

	@Override
	public String toString() {
		return doiString;
	}

	@Override
	public int hashCode() {
		return doiString.hashCode();
	}

	@Override
	public boolean equals(Object other) {
		if (other == null) {
			return false;
		}
		if (this == other) {
			return true;
		}
		if (other instanceof Doi otherDoi) {
			return doiString.equals(otherDoi.doiString);
		}

		return false;
	}
}
