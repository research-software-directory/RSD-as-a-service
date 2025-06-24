// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.Optional;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class Argon2Verifier {

	Optional<String> verify(String token, String tokenID) throws RsdAccessTokenException {
		AccessToken hashedToken = getHashForTokenID(tokenID);
		Argon2PasswordEncoder encoder = Argon2Creator.argon2Encoder();
		Boolean tokenIsValid = encoder.matches(token, hashedToken.secret());
		if (Boolean.TRUE.equals(tokenIsValid)) {
			return Optional.of(hashedToken.account());
		}
		return Optional.empty();
	}

	AccessToken getHashForTokenID(String tokenID) throws RsdAccessTokenException {
		try {
			String backendUri = Config.backendBaseUrl();
			String fullUrl = backendUri + "/user_access_token?id=eq." + tokenID;
			String tokenResponse = Utils.getAsAdmin(fullUrl);
			JsonArray jsonArray = JsonParser.parseString(tokenResponse).getAsJsonArray();
			JsonObject jsonObject = jsonArray.get(0).getAsJsonObject();
			Gson gson = new Gson();
			return gson.fromJson(jsonObject, AccessToken.class);
		} catch (Exception e) {
			throw new RsdAccessTokenException.UnverifiedAccessTokenException("Cannot verify access token");
		}

	}


}
