// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class PostgrestCheckOrcidWhitelistedAccount implements Account {

	private Account origin;

	public PostgrestCheckOrcidWhitelistedAccount(Account origin) {
		this.origin = Objects.requireNonNull(origin);
	}

	@Override
	public AccountInfo account(OpenIdInfo openIdInfo, OpenidProvider provider) {
		Objects.requireNonNull(openIdInfo);
		Objects.requireNonNull(provider);

		if (provider != OpenidProvider.orcid) return origin.account(openIdInfo, provider);

		String backendUri = Config.backendBaseUrl();
		String orcid = openIdInfo.sub();
		String orcidEncoded = URLEncoder.encode(orcid, StandardCharsets.UTF_8);
		URI queryUri = URI.create(backendUri + "/orcid_whitelist?orcid=eq." + orcidEncoded);
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String token = jwtCreator.createAdminJwt();
		String response = PostgrestAccount.getAsAdmin(queryUri, token);
		if (!orcidInResponse(orcid, response)) throw new RsdAuthenticationException("Your ORCID (" + orcid + ") is not whitelisted.");

		return origin.account(openIdInfo, provider);
	}

	static boolean orcidInResponse(String orcid, String response) {
		JsonElement responseJsonTree = JsonParser.parseString(response);
		JsonArray responseArray = responseJsonTree.getAsJsonArray();
		if (responseArray.size() != 1) return false;

		JsonObject responseObject = responseArray.get(0).getAsJsonObject();
		return responseObject.getAsJsonPrimitive("orcid").getAsString().equals(orcid);
	}
}
