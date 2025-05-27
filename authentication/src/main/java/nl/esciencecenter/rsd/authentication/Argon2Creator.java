// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.io.IOException;
import java.net.URI;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Argon2Creator {

	private static final Integer saltLength = 16;
	private static final Integer hashLength = 64;
	private static final Integer parallelism = 1;
	private static final Integer memory = 12288;
	private static final Integer iterations = 3;

	public static String generateNewAccessToken(String account, String displayName, String expiresAt) throws RsdAccessTokenException {
		String opaqueToken = generateOpaqueToken();
		String secret = generateArgon2Hash(opaqueToken);
		String tokenID = saveTokenToDatabase(secret, account, displayName, expiresAt);
		return tokenID + "." + opaqueToken;
	}

	public static Argon2PasswordEncoder argon2Encoder() {
		return new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);
	}

	public static String generateArgon2Hash(String opaqueToken) {
		Argon2PasswordEncoder encoder = argon2Encoder();
		return encoder.encode(opaqueToken);
	}

    // Method to generate a random opaque token using UUID
    private static String generateOpaqueToken() {
        return UUID.randomUUID().toString();
    }

	private static String saveTokenToDatabase(String secret, String account, String displayName, String expiresAt) throws RsdAccessTokenException {
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
		} catch (PostgresUniqueConstraintException e) {
			throw new RsdAccessTokenException("RsdAccessTokenException: Token name should be unique", e);
		} catch (PostgresForeignKeyConstraintException | PostgresCustomException | IOException | InterruptedException e) {
			throw new RsdAccessTokenException("RsdAccessTokenException: " + e.getMessage(), e);
		}

	}

	public static String getAllTokensForUser(String accountID, String jwtToken) {
		String backendUri = Config.backendBaseUrl();
		URI queryUri = URI.create(backendUri + "/rpc/my_user_access_tokens");
		return Utils.makeBasicRequest("GET", Optional.empty(), queryUri, jwtToken).body();
	}

	public static Integer deleteTokenFromDatabase(String accessTokenID, String jwtToken) {
		String backendUri = Config.backendBaseUrl();
		URI queryUri = URI.create(backendUri + "/rpc/delete_my_user_access_token");
		return Utils.makeBasicRequest("POST", Optional.of("{\"id\":\"" + accessTokenID + "\"}"), queryUri, jwtToken).statusCode();
	}
	
}
