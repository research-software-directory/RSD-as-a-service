// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

public class RorScraper {

	private final RorId rorId;

	public RorScraper(RorId rorId) {
		this.rorId = Objects.requireNonNull(rorId);
	}

	private String getFromApi() throws IOException, InterruptedException, RsdResponseException {
		// e.g https://api.ror.org/v2/organizations/04tsk2644
		return Utils.get(rorId.asApiV2Url().toString());
	}

	public RorData scrapeData() throws RsdResponseException, IOException, InterruptedException, RsdParsingException {
		String json = getFromApi();
		return parseV2Data(json);
	}

	// the full schema is at https://github.com/ror-community/ror-schema/blob/master/ror_schema_v2_1.json
	static RorData parseV2Data(String json) throws RsdParsingException {
		try {
			JsonObject parsedJson = JsonParser.parseString(json).getAsJsonObject();

			JsonArray addressesJson = parsedJson.getAsJsonArray("locations");
			// what to do when multiple addresses exist?
			JsonObject firstAddressJson = addressesJson.get(0).getAsJsonObject().getAsJsonObject("geonames_details");

			JsonElement countryJson = firstAddressJson.get("country_name");
			String country = (countryJson != null && countryJson.isJsonPrimitive())
				? countryJson.getAsJsonPrimitive().getAsString()
				: null;

			String city = firstAddressJson.getAsJsonPrimitive("name").getAsString();

			JsonElement latJson = firstAddressJson.get("lat");
			Double lat = (latJson != null && latJson.isJsonPrimitive())
				? latJson.getAsJsonPrimitive().getAsDouble()
				: null;

			JsonElement lonJson = firstAddressJson.get("lng");
			Double lon = (lonJson != null && lonJson.isJsonPrimitive())
				? lonJson.getAsJsonPrimitive().getAsDouble()
				: null;

			JsonArray linksJson = parsedJson.getAsJsonArray("links");
			String wikipediaUrl = null;
			for (JsonElement jsonElement : linksJson) {
				JsonObject linkObjectJson = jsonElement.getAsJsonObject();
				if (linkObjectJson.getAsJsonPrimitive("type").getAsString().equals("wikipedia")) {
					wikipediaUrl = linkObjectJson.getAsJsonPrimitive("value").getAsString();
					break;
				}
			}

			JsonArray typesJson = parsedJson.getAsJsonArray("types");
			List<String> rorTypes = new ArrayList<>(typesJson.size());
			for (JsonElement jsonElement : typesJson) {
				rorTypes.add(jsonElement.getAsString());
			}

			JsonArray namesJson = parsedJson.getAsJsonArray("names");
			List<String> rorNames = new ArrayList<>(namesJson.size());
			for (JsonElement jsonElement : namesJson) {
				rorNames.add(jsonElement.getAsJsonObject().getAsJsonPrimitive("value").getAsString());
			}

			return new RorData(country, city, wikipediaUrl, rorTypes, rorNames, lat, lon);
		} catch (RuntimeException e) {
			throw new RsdParsingException("Error parsing JSON data from ROR API", e);
		}
	}
}
