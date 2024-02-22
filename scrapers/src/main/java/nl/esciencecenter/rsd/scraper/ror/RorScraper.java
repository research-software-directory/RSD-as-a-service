// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.io.IOException;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

public class RorScraper {

	private String rorApiUrl;
	private JsonObject apiObject;

	public RorScraper(String rorApiUrl) throws IOException, InterruptedException, RsdResponseException, JsonParseException, JsonSyntaxException {
		this.rorApiUrl = rorApiUrl;
		getFromApi();
	}

	private void getFromApi() throws IOException, InterruptedException, RsdResponseException, JsonParseException, JsonSyntaxException {
		String jsonResponse = Utils.get(rorApiUrl);
		apiObject = JsonParser.parseString(jsonResponse).getAsJsonObject();
	}

	public String country() {
		String country = null;
		JsonObject jsonCountry = apiObject.has("country") ? apiObject.get("country").getAsJsonObject() : new JsonObject();
		if (! jsonCountry.isEmpty()) {
			JsonElement jsonCountryName = jsonCountry.has("country_name") ? jsonCountry.get("country_name") : new JsonObject();
			country = jsonCountryName.isJsonNull() ? null : jsonCountryName.getAsString();
		}
		return country;
	}

	public String city() {
		String city = null;
		JsonArray jsonAddresses = apiObject.has("addresses") ? apiObject.get("addresses").getAsJsonArray() : new JsonArray();
		if (! jsonAddresses.isEmpty()) {
			JsonElement jsonFirstAddress = jsonAddresses.get(0);
			JsonElement jsonCity = jsonFirstAddress.isJsonNull() ? new JsonObject() : jsonFirstAddress.getAsJsonObject().get("city");
			city = jsonCity.isJsonNull() ? null : jsonCity.getAsString();
		}
		return city;
	}
}
