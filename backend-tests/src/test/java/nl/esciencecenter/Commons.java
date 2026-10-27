// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.http.Header;
import java.util.Base64;
import java.util.Locale;
import java.util.Random;
import java.util.UUID;

public class Commons {

	private static final Random random = new Random();

	static final Header returnRepresentationHeader = new Header("Prefer", "return=representation");
	static final Header ignoreDuplicatesHeader = new Header("Prefer", "resolution=ignore-duplicates");
	static final String authUrl =
		System.getenv("AUTH_URL") == null ? "http://localhost:80/auth" : System.getenv("AUTH_URL");
	static final String apiV2Url =
		System.getenv("AUTH_URL") == null ? "http://localhost:80/api/v2" : System.getenv("API_V2_URL");

	static String createUUID() {
		return UUID.randomUUID().toString();
	}

	static String generateRandomShortString() {
		byte[] randomBytes = new byte[3];
		random.nextBytes(randomBytes);
		return Base64.getUrlEncoder().encodeToString(randomBytes);
	}

	/**
	 *
	 * @param s the string to slugify, cannot be null
	 * @return the input for which the letters A-Z are converted to lower case,
	 * the digits 0-9 are unchanged,
	 * other characters have been converted to a dash,
	 * leading, trailing and more than one duplicate dashes have been removed
	 */
	static String slugify(String s) {
		return s.toLowerCase(Locale.ENGLISH).replaceAll("[^a-z0-9]+", "-").replaceAll("^-", "").replaceAll("-$", "");
	}
}
