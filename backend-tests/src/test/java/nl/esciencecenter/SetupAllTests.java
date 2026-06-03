// SPDX-FileCopyrightText: 2024 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.restassured.RestAssured;
import io.restassured.http.Header;
import java.util.Date;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class SetupAllTests implements BeforeAllCallback {

	@Override
	public void beforeAll(ExtensionContext extensionContext) {
		setupRestAssured();
	}

	public static Header adminAuthHeader;

	public static void setupRestAssured() {
		RestAssured.baseURI = System.getenv("POSTGREST_URL");
		RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		String adminToken = JWT.create()
			.withClaim("iss", "rsd_test")
			.withClaim("role", "rsd_admin")
			.withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // expires in one hour
			.sign(signingAlgorithm);
		adminAuthHeader = new Header("Authorization", "bearer " + adminToken);

		User.adminAuthHeader = adminAuthHeader;
	}
}
