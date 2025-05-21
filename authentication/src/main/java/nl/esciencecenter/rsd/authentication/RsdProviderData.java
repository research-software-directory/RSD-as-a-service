// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonObject;

import java.net.URI;

public record RsdProviderData(
	OpenidProvider openidProvider,
	OpenidProviderAccessMethod accessMethod,
	URI wellKnownUrl,
	String displayName,
	String htmlDescription
) {

	public JsonObject toJson() {
		JsonObject jsonObject = new JsonObject();

		jsonObject.addProperty("openidProvider", openidProvider.toString());
		jsonObject.addProperty("accessMethod", accessMethod.toString());
		jsonObject.addProperty("displayName", displayName);
		jsonObject.addProperty("htmlDescription", htmlDescription);

		return jsonObject;
	}
}
