// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import nl.esciencecenter.rsd.authentication.Main;
import org.jetbrains.annotations.NotNull;

public class CreateAccessTokenHandler implements Handler {

	@Override
	public void handle(@NotNull Context ctx) throws InterruptedException {
		String accountId = Main.extractAccountFromCookie(ctx);

		String requestBody = ctx.body();
		JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();
		String displayName = jsonObject.get("display_name").getAsString();
		String expiresAt = jsonObject.get("expires_at").getAsString();

		try {
			String accessToken = Argon2Creator.generateNewAccessToken(accountId, displayName, expiresAt);
			ctx.result("{\"access_token\":\"" + accessToken + "\"}").contentType("application/json");
			ctx.status(201);
		} catch (RsdAccessTokenException e) {
			ctx.status(400).result(e.getMessage());
		}
	}
}
