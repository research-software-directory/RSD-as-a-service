// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import io.javalin.http.HttpStatus;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import nl.esciencecenter.rsd.authentication.JsonErrorMessageCreator;
import nl.esciencecenter.rsd.authentication.Main;
import nl.esciencecenter.rsd.authentication.RsdResponseException;
import org.jetbrains.annotations.NotNull;

public class CreateAccessTokenHandler implements Handler {

	private static final String INVALID_ACCESS_TOKEN_REQUEST_MESSAGE = "Invalid access token request";

	@Override
	public void handle(@NotNull Context ctx) throws InterruptedException, IOException {
		String accountId = Main.extractAccountFromCookie(ctx);

		String requestBody = ctx.body();
		JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();
		String displayName = jsonObject.get("display_name").getAsString();
		String expiresAtString = jsonObject.get("expires_at").getAsString();
		LocalDate expiresAt;
		try {
			expiresAt = LocalDate.parse(expiresAtString);
		} catch (DateTimeParseException e) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_REQUEST_MESSAGE,
				List.of("The expiry date is has a wrong format")
			);

			ctx.status(HttpStatus.BAD_REQUEST).json(jsonError);
			return;
		}
		if (LocalDate.now().isAfter(expiresAt)) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_REQUEST_MESSAGE,
				List.of("The expiry date should be in the future")
			);

			ctx.status(HttpStatus.BAD_REQUEST).json(jsonError);
			return;
		}

		try {
			String accessToken = Argon2Creator.generateNewAccessToken(accountId, displayName, expiresAt);
			ctx.result("{\"access_token\":\"" + accessToken + "\"}").contentType("application/json");
			ctx.status(201);
		} catch (RsdResponseException e) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				"Could not create access token",
				List.of(e.uri.toString(), Integer.toString(e.statusCode), e.body)
			);
			ctx.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonError);
		}
	}
}
