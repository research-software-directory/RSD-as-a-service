// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class JwtCreator {

	static final long ONE_HOUR_IN_MILLISECONDS = 3600_000L; // 60 * 60 * 1000
	static final long FIFTEEN_MINUTES_IN_MILLISECOND = 900_000L;
	private final Algorithm signingAlgorithm;
	private static final String RSD_ADMIN_ROLE = "rsd_admin";
	private static final String RSD_USER_ROLE = "rsd_user";
	private static final String RSD_AUTH_ROLE = "rsd_auth";

	public JwtCreator(String signingSecret) {
		Objects.requireNonNull(signingSecret);
		this.signingAlgorithm = Algorithm.HMAC256(signingSecret);
	}

	String createUserJwt(AccountInfo accountInfo) {
		return JWT.create()
			.withClaim("iss", RSD_AUTH_ROLE)
			.withClaim("role", accountInfo.isAdmin() ? RSD_ADMIN_ROLE : RSD_USER_ROLE)
			.withClaim("account", accountInfo.account().toString())
			.withClaim("name", accountInfo.name())
			.withClaim("data", accountInfo.data())
			.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
			.sign(signingAlgorithm);
	}

	public String createAdminJwt() {
		return JWT.create()
			.withClaim("iss", RSD_AUTH_ROLE)
			.withClaim("role", RSD_ADMIN_ROLE)
			.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
			.sign(signingAlgorithm);
	}

	public String createAccessTokenJwt(String accountID, String tokenID) {
		return JWT.create()
			.withClaim("iss", RSD_AUTH_ROLE)
			.withClaim("role", RSD_USER_ROLE)
			.withClaim("account", accountID)
			.withClaim("type", "access_token_" + ((tokenID != null) ? tokenID : ""))
			.withExpiresAt(new Date(System.currentTimeMillis() + FIFTEEN_MINUTES_IN_MILLISECOND))
			.sign(signingAlgorithm);
	}

	String refreshToken(String token) throws IOException, InterruptedException {
		DecodedJWT oldJwt = JWT.decode(token);
		UUID accountId = UUID.fromString(oldJwt.getClaim("account").asString());
		boolean isAdmin = new PostgrestAccount(Config.backendBaseUrl()).isAdmin(accountId);
		String payloadEncoded = oldJwt.getPayload();
		String payloadDecoded = Main.decode(payloadEncoded);
		Gson gson = new Gson();
		Map<String, ?> claimsMap = gson.<Map<String, ?>>fromJson(payloadDecoded, Map.class);
		return JWT.create()
			.withPayload(claimsMap)
			.withClaim("role", isAdmin ? RSD_ADMIN_ROLE : RSD_USER_ROLE)
			.withExpiresAt(new Date(System.currentTimeMillis() + ONE_HOUR_IN_MILLISECONDS))
			.sign(signingAlgorithm);
	}
}
