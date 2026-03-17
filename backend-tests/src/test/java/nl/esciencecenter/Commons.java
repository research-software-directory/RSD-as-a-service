// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import io.restassured.http.Header;
import java.util.UUID;

public class Commons {

	static final Header requestEntry = new Header("Prefer", "return=representation");
	static final String authUrl =
		System.getenv("AUTH_URL") == null ? "http://localhost:80/auth" : System.getenv("AUTH_URL");
	static final String apiV2Url =
		System.getenv("AUTH_URL") == null ? "http://localhost:80/api/v2" : System.getenv("API_V2_URL");

	static String createUUID() {
		return UUID.randomUUID().toString();
	}
}
