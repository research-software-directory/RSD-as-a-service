// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Argon2Creator {

	private static final Integer SALT_LENGTH = 16;
	private static final Integer HASH_LENGTH = 64;
	private static final Integer PARALLELISM = 1;
	private static final Integer MEMORY = 12288;
	private static final Integer ITERATIONS = 3;

	public static String generateNewAccessToken(String account, String displayName, String expiresAt) throws RsdAccessTokenException, InterruptedException {
		String opaqueToken = generateOpaqueToken();
		String secret = generateArgon2Hash(opaqueToken);
		String tokenID = saveTokenToDatabase(secret, account, displayName, expiresAt);
		return tokenID + "." + opaqueToken;
	}

	public static Argon2PasswordEncoder argon2Encoder() {
		return new Argon2PasswordEncoder(SALT_LENGTH, HASH_LENGTH, PARALLELISM, MEMORY, ITERATIONS);
	}

	public static String generateArgon2Hash(String opaqueToken) {
		Argon2PasswordEncoder encoder = argon2Encoder();
		return encoder.encode(opaqueToken);
	}

	// Method to generate a random opaque token using UUID
	private static String generateOpaqueToken() {
		return UUID.randomUUID().toString();
	}

	private static String saveTokenToDatabase(String secret, String account, String displayName, String expiresAt) throws RsdAccessTokenException, InterruptedException {
		JsonObject userAccessTokenData = new JsonObject();
		userAccessTokenData.addProperty("secret", secret);
		userAccessTokenData.addProperty("account", account);
		userAccessTokenData.addProperty("expires_at", expiresAt);
		userAccessTokenData.addProperty("display_name", displayName);

		String backendUri = Config.backendBaseUrl();
		URI queryUri = URI.create(backendUri + "/user_access_token?select=id");
		String signingSecret = Config.jwtSigningSecret();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);
		String jwtToken = jwtCreator.createAdminJwt();
		try {
			String tokenResponse = PostgrestAccount.postJsonAsAdmin(queryUri, userAccessTokenData.toString(), jwtToken);
			UUID tokenID = UUID.fromString(
				JsonParser.parseString(tokenResponse)
					.getAsJsonArray()
					.get(0)
					.getAsJsonObject()
					.get("id")
					.getAsString()
			);
			return tokenID.toString();
		} catch (PostgresForeignKeyConstraintException | PostgresCustomException | IOException e) {
			throw new RsdAccessTokenException("RsdAccessTokenException: " + e.getMessage(), e);
		}

	}

}
