// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonObject;

import java.io.IOException;
import java.net.URI;

public class PostgrestConnector {

	private PostgrestConnector() {
	}

	public static void addOrcidToAllowList(String orcid) throws IOException, InterruptedException {
		String backendUri = Config.backendBaseUrl();
		URI allowListUri = URI.create(backendUri + "/orcid_whitelist");
		JwtCreator jwtCreator = new JwtCreator(Config.jwtSigningSecret());
		String adminJwt = jwtCreator.createAdminJwt();

		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("orcid", orcid);

		PostgrestAccount.postJsonAsAdmin(allowListUri, jsonObject.toString(), adminJwt, "Prefer", "resolution=ignore-duplicates");
	}
}
