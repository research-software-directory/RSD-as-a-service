// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.time.ZonedDateTime;
import java.util.Optional;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class AccessTokenVerifier {

	private static final Gson gson = new GsonBuilder()
		.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
		.registerTypeAdapter(ZonedDateTime.class, (JsonDeserializer<ZonedDateTime>) (src, typeOfSrc, context) -> ZonedDateTime.parse(src.getAsString()))
		.create();

	Optional<String> getAccountIdIfValid(String secret, String tokenID) throws RsdAccessTokenException {
		AccessToken accessToken = getHashForTokenID(tokenID);
		Argon2PasswordEncoder encoder = Argon2Creator.argon2Encoder();
		boolean tokenIsValid = encoder.matches(secret, accessToken.secret()) && ZonedDateTime.now()
			.isBefore(accessToken.expiresAt());

		return tokenIsValid ? Optional.of(accessToken.account().toString()) : Optional.empty();
	}

	AccessToken getHashForTokenID(String tokenID) throws RsdAccessTokenException {
		try {
			String backendUri = Config.backendBaseUrl();
			String fullUrl = backendUri + "/user_access_token?id=eq." + tokenID;
			String tokenResponse = Utils.getAsAdmin(fullUrl);
			JsonArray jsonArray = JsonParser.parseString(tokenResponse).getAsJsonArray();
			JsonObject jsonObject = jsonArray.get(0).getAsJsonObject();
			return gson.fromJson(jsonObject, AccessToken.class);
		} catch (Exception e) {
			throw new RsdAccessTokenException.UnverifiedAccessTokenException("Cannot verify access token");
		}
	}
}
