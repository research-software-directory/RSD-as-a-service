// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// This authentication provider was developed to work with the Imperial College Azure
// tenant. In principle it should be generic enough to work with a registered
// application from any Azure Active Directory tenant however this has not been tested
// and changes may be needed to further generalise it.

public class AzureLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public AzureLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() throws IOException, InterruptedException, RsdResponseException {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromAzureconext(form);
		String idToken = extractIdToken(tokenResponse);
		DecodedJWT idJwt = JWT.decode(idToken);
		String subject = idJwt.getSubject();
		String email = idJwt.getClaim("email").asString();
		String name = idJwt.getClaim("name").asString();
		Map<String, List<String>> emptyData = Collections.emptyMap();
		return new OpenIdInfo(subject, name, email, Config.azureOrganisation(), emptyData);
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("scope", "openid");
		form.put("client_id", Config.azureClientId());
		form.put("client_secret", Config.azureClientSecret());
		return form;
	}

	private String getTokensFromAzureconext(Map<String, String> form) throws IOException, InterruptedException, RsdResponseException {
		URI tokenEndpoint = Utils.getTokenUrlFromWellKnownUrl(URI.create(Config.azureWellknown()));
		return Utils.postForm(tokenEndpoint, form);
	}

	private String extractIdToken(String response) {
		return JsonParser.parseString(response).getAsJsonObject().getAsJsonPrimitive("id_token").getAsString();
	}
}
