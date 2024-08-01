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

public class OrcidLogin implements Login {

	private final String code;
	private final String redirectUrl;

	public OrcidLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	@Override
	public OpenIdInfo openidInfo() throws IOException, InterruptedException, RsdResponseException {
		Map<String, String> form = createForm();
		String tokenResponse = getTokensFromOrcidconext(form);
		String idToken = extractIdToken(tokenResponse);

		DecodedJWT idJwt = JWT.decode(idToken);
		String subject = idJwt.getSubject();
		String name = idJwt.getClaim("name").asString();
		if (name == null) {
			String givenName = idJwt.getClaim("given_name").asString();
			String familyName = idJwt.getClaim("family_name").asString();
			if (givenName != null && familyName != null) name = givenName + " " + familyName;
			else if (familyName != null) name = familyName;
			else if (givenName != null) name = givenName;
		}
		Map<String, List<String>> emptyData = Collections.emptyMap();
		return new OpenIdInfo(subject, name, null, null, emptyData);
	}

	private Map<String, String> createForm() {
		Map<String, String> form = new HashMap<>();
		form.put("code", code);
		form.put("grant_type", "authorization_code");
		form.put("redirect_uri", redirectUrl);
		form.put("scope", "openid");
		form.put("client_id", Config.orcidClientId());
		form.put("client_secret", Config.orcidClientSecret());
		return form;
	}

	private String getTokensFromOrcidconext(Map<String, String> form) throws IOException, InterruptedException, RsdResponseException {
		URI tokenEndpoint = Utils.getTokenUrlFromWellKnownUrl(URI.create(Config.orcidWellknown()));
		return Utils.postForm(tokenEndpoint, form);
	}

	private String extractIdToken(String response) {
		return JsonParser.parseString(response).getAsJsonObject().getAsJsonPrimitive("id_token").getAsString();
	}
}
