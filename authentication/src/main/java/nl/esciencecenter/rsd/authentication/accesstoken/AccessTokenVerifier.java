// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.UUID;
import nl.esciencecenter.rsd.authentication.Config;
import nl.esciencecenter.rsd.authentication.RsdResponseException;
import nl.esciencecenter.rsd.authentication.Utils;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

public class AccessTokenVerifier {

	private static final Gson gson = new GsonBuilder()
		.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
		.registerTypeAdapter(
			ZonedDateTime.class,
			(JsonDeserializer<ZonedDateTime>) (src, typeOfSrc, context) -> ZonedDateTime.parse(src.getAsString())
		)
		.create();

	public UUID getAccountIdFromToken(String secret, UUID tokenID)
		throws RsdAccessTokenException, RsdResponseException, IOException, InterruptedException {
		AccessToken accessToken = getHashForTokenID(tokenID);
		Argon2PasswordEncoder encoder = Argon2Creator.argon2Encoder();

		if (!encoder.matches(secret, accessToken.secret())) {
			throw new RsdAccessTokenException("Access token is invalid");
		}

		if (ZonedDateTime.now().isAfter(accessToken.expiresAt())) {
			throw new RsdAccessTokenException("Access token is expired");
		}

		return accessToken.account();
	}

	private AccessToken getHashForTokenID(UUID tokenID)
		throws RsdAccessTokenException, RsdResponseException, IOException, InterruptedException {
		String backendUri = Config.backendBaseUrl();
		String fullUrl = backendUri + "/user_access_token?id=eq." + tokenID;
		String tokenResponse = Utils.getAsAdmin(fullUrl);
		JsonArray jsonArray = JsonParser.parseString(tokenResponse).getAsJsonArray();

		if (jsonArray.isEmpty()) {
			throw new RsdAccessTokenException("Access token not found");
		}

		JsonObject jsonObject = jsonArray.get(0).getAsJsonObject();
		return gson.fromJson(jsonObject, AccessToken.class);
	}
}
