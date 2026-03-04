// SPDX-FileCopyrightText: 2025 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import io.javalin.http.HandlerType;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;
import nl.esciencecenter.rsd.authentication.Config;
import nl.esciencecenter.rsd.authentication.Utils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProxyWithAccessTokenHandler implements Handler {

	private static final HttpClient httpClient = HttpClient.newHttpClient();
	private static final Logger LOGGER = LoggerFactory.getLogger(ProxyWithAccessTokenHandler.class);

	/**
	 * Proxies the request to PostgREST
	 */
	@Override
	public void handle(@NotNull Context ctx) throws IOException, InterruptedException {
		String path = ctx.path().substring("/api/v2".length());
		String fullUrl = Config.backendBaseUrl() + path + ((ctx.queryString() != null) ? "?" + ctx.queryString() : "");

		HttpRequest.Builder requestBuilder = HttpRequest.newBuilder().uri(URI.create(fullUrl));

		if (ctx.attribute("X-API-Authorization-Header") != null) {
			requestBuilder.header("Authorization", ctx.attribute("X-API-Authorization-Header"));
		}

		ctx
			.headerMap()
			.forEach((k, v) -> {
				if (!Utils.isForbiddenHeader(k) && !k.equalsIgnoreCase("authorization") && v != null) {
					try {
						requestBuilder.header(k, v);
					} catch (IllegalArgumentException e) {
						LOGGER.warn("Invalid or forbidden header: {}", k);
					}
				}
			});

		HandlerType method = ctx.method();
		HttpRequest request;
		if (
			method.equals(HandlerType.GET) ||
			method.equals(HandlerType.DELETE) ||
			method.equals(HandlerType.HEAD) ||
			method.equals(HandlerType.OPTIONS)
		) {
			request = requestBuilder.method(method.toString(), HttpRequest.BodyPublishers.noBody()).build();
		} else if (
			method.equals(HandlerType.POST) || method.equals(HandlerType.PUT) || method.equals(HandlerType.PATCH)
		) {
			String body = ctx.body();
			String contentType = ctx.contentType() != null ? ctx.contentType() : "application/json";
			requestBuilder.header("Content-Type", contentType);
			request = requestBuilder.method(method.toString(), HttpRequest.BodyPublishers.ofString(body)).build();
		} else {
			throw new AssertionError("Unsupported HTTP method: " + method);
		}

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		if (method == HandlerType.OPTIONS) {
			Optional<String> allowValues = response.headers().firstValue("Allow");
			allowValues.ifPresent(s -> ctx.header("Allow", s));
		}

		ctx.status(response.statusCode());
		ctx.json(response.body());
	}
}
