// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RorId {

	private static final String ROR_BASE_URL = "https://ror.org/";
	private static final String ROR_BASE_API_URL = "https://api.ror.org/organizations/";
	// https://ror.readme.io/docs/identifier
	// we haven't implemented the checksum of the last two digits, maybe something to do later;
	// but we don't have this check in the database either
	private static final Pattern ROR_URL_PATTERN = Pattern.compile("^https://ror\\.org/(0[a-hj-km-np-tv-z|\\d]{6}\\d{2})$");

	private final String id;

	private RorId(String id) {
		this.id = id;
	}

	public static boolean isValidRorUrl(String url) {
		return url != null && ROR_URL_PATTERN.asPredicate().test(url);
	}

	public static RorId fromUrlString(String url) {
		if (!isValidRorUrl(url)) {
			throw new IllegalArgumentException();
		}

		Matcher matcher = ROR_URL_PATTERN.matcher(url);
		matcher.find();
		String id = matcher.group(1);
		return new RorId(id);
	}

	public URI asUrl() {
		return URI.create(ROR_BASE_URL + id);
	}

	public URI asApiUrl() {
		return URI.create(ROR_BASE_API_URL + id);
	}

	@Override
	public String toString() {
		return ROR_BASE_URL + id;
	}

	@Override
	public int hashCode() {
		return id.hashCode();
	}

	@Override
	public boolean equals(Object other) {
		if (other == null) {
			return false;
		}
		if (this == other) {
			return true;
		}
		if (other instanceof RorId otherRorId) {
			return id.equals(otherRorId.id);
		}

		return false;
	}
}
