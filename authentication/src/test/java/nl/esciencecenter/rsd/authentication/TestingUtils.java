// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.UUID;

class TestingUtils {

	private TestingUtils() {}

	/**
	 * Generate a random string, with no cryptographic guarantees whatsoever.
	 *
	 * @return a random non-empty string
	 */
	static String randomString() {
		return UUID.randomUUID().toString();
	}
}
