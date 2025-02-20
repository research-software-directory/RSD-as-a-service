// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.net.URI;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This class represents ROR identifiers as described in <a href="https://ror.readme.io/docs/identifier">the ROR documentation</a>.
 * <p>
 * A {@link #isValidRorUrl(String) static factory method} is provided to construct instances of this class from a full URL string.
 * As such, any instance of this class is guaranteed to contain a syntactically valid ROR ID.
 * However, the last two digits of a ROR ID should be a checksum;  we don't currently validate this checksum.
 */
public class RorId {

	private static final String ROR_BASE_URL = "https://ror.org/";
	// https://ror.org/blog/2024-04-15-announcing-ror-v2/
	private static final String ROR_BASE_API_V1_URL = "https://api.ror.org/v1/organizations/";
	private static final Pattern ROR_URL_PATTERN = Pattern.compile("^https://ror\\.org/(0[a-hj-km-np-tv-z|\\d]{6}\\d{2})$");

	private final String id;

	private RorId(String id) {
		this.id = id;
	}

	/**
	 * Tests if a URL string is a valid ROR ID as described in <a href="https://ror.readme.io/docs/identifier">the ROR documentation</a>.
	 * The checksum is not validated though.
	 *
	 * @param url the URL string to validate
	 * @return whether or not the provided URL is a valid ROR ID
	 */
	public static boolean isValidRorUrl(String url) {
		return url != null && ROR_URL_PATTERN.asPredicate().test(url);
	}

	/**
	 * A factory method to create instanced of RorId.
	 * Only full URLs that look like {@code https://ror.org/02mhbdp94} are accepted.
	 * <p>
	 * Callers of this method should call {@link #isValidRorUrl(String)} first to validate their URL and
	 * thus to prevent an exception from being thrown.
	 *
	 * @param url a non-null URL string that satisfies the conditions in <a href="https://ror.readme.io/docs/identifier">the ROR documentation</a>
	 * @return a non-null instance of a RorId
	 * @throws NullPointerException     when {@code url} is {@code null}
	 * @throws IllegalArgumentException when {@code url} is not a valid ROR ID
	 */
	public static RorId fromUrlString(String url) {
		Objects.requireNonNull(url);
		if (!isValidRorUrl(url)) {
			throw new IllegalArgumentException("The url %s is not a valid ROR ID".formatted(url));
		}

		Matcher matcher = ROR_URL_PATTERN.matcher(url);
		matcher.find();
		String id = matcher.group(1);
		return new RorId(id);
	}

	public URI asUrl() {
		return URI.create(ROR_BASE_URL + id);
	}

	public URI asApiV1Url() {
		return URI.create(ROR_BASE_API_V1_URL + id);
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
