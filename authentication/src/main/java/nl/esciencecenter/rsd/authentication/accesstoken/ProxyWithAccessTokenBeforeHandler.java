// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import io.javalin.http.HttpStatus;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import nl.esciencecenter.rsd.authentication.Config;
import nl.esciencecenter.rsd.authentication.JsonErrorMessageCreator;
import nl.esciencecenter.rsd.authentication.JwtCreator;
import nl.esciencecenter.rsd.authentication.RsdResponseException;
import org.jetbrains.annotations.NotNull;

public class ProxyWithAccessTokenBeforeHandler implements Handler {

	private static final String INVALID_ACCESS_TOKEN_MESSAGE = "Invalid access token";

	@Override
	public void handle(@NotNull Context ctx) throws IOException, InterruptedException {
		String authHeader = ctx.header("Authorization");

		if (authHeader == null) {
			// the request is from the frontend, skip access token validation
			return;
		}

		if (!authHeader.startsWith("Bearer ")) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_MESSAGE,
				List.of("The Authorization header must start with \"Bearer \"")
			);

			ctx.status(HttpStatus.UNAUTHORIZED).json(jsonError).skipRemainingHandlers();
			return;
		}

		// length of "Bearer "
		String authToken = authHeader.substring(7);

		String[] tokenParts = authToken.split("\\.", 2);
		if (tokenParts.length < 2) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_MESSAGE,
				List.of("The access token must contain at least one dot")
			);

			ctx.status(HttpStatus.UNAUTHORIZED).json(jsonError).skipRemainingHandlers();
			return;
		}

		UUID tokenID;
		try {
			tokenID = UUID.fromString(tokenParts[0]);
		} catch (RuntimeException e) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_MESSAGE,
				List.of("The part before the dot must be a UUID")
			);

			ctx.status(HttpStatus.UNAUTHORIZED).json(jsonError).skipRemainingHandlers();
			return;
		}

		String tokenSecret = tokenParts[1];

		AccessTokenVerifier verifier = new AccessTokenVerifier();
		UUID accountId;

		try {
			accountId = verifier.getAccountIdFromToken(tokenSecret, tokenID);
		} catch (RsdAccessTokenException e) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				INVALID_ACCESS_TOKEN_MESSAGE,
				List.of(e.getMessage())
			);

			ctx.status(HttpStatus.UNAUTHORIZED).json(jsonError).skipRemainingHandlers();
			return;
		} catch (RsdResponseException e) {
			String jsonError = JsonErrorMessageCreator.createErrorJson(
				"Could not verify access token due to internal error",
				List.of(e.uri.toString(), Integer.toString(e.statusCode), e.body)
			);
			ctx.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonError).skipRemainingHandlers();
			return;
		}

		String userID = accountId.toString();
		String signingSecret = Config.jwtSigningSecret();
		JwtCreator jwtCreator = new JwtCreator(signingSecret);
		String token = jwtCreator.createAccessTokenJwt(userID, tokenID.toString());
		ctx.attribute("X-API-Authorization-Header", "Bearer " + token);
	}
}
