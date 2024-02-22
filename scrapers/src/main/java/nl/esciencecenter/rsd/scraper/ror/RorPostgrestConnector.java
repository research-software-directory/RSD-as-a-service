// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.Utils;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

public class RorPostgrestConnector {
	private final String backendUrl;

	public RorPostgrestConnector() {
		this.backendUrl = Config.backendBaseUrl();
	}

	public Collection<BasicOrganisationData> organisationsWithoutLocation(int limit) {
		String filter = "organisation?ror_id=not.is.null&or=(country.is.null,city.is.null)&limit=" + limit;
		String data = Utils.getAsAdmin(backendUrl + "/" + filter);
		return parseBasicJsonData(data);
	}

	static Collection<BasicOrganisationData> parseBasicJsonData(String data) {
		JsonArray dataInArray = JsonParser.parseString(data).getAsJsonArray();
		Collection<BasicOrganisationData> result = new ArrayList<>();
		for (JsonElement element : dataInArray) {
			JsonObject organisationJson = element.getAsJsonObject();
			UUID id = UUID.fromString(organisationJson.getAsJsonPrimitive("id").getAsString());
			String rorId = organisationJson.getAsJsonPrimitive("ror_id").getAsString();
			String country = organisationJson.get("country").isJsonNull() ? null : organisationJson.getAsJsonPrimitive("country").getAsString();
			String city = organisationJson.get("city").isJsonNull() ? null : organisationJson.getAsJsonPrimitive("city").getAsString();
			result.add(new BasicOrganisationData(id, rorId, country, city));
		}
		return result;
	}

	public void saveLocationData(BasicOrganisationDatabaseData organisationData) {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("country", organisationData.basicData().country());
		jsonObject.addProperty("city", organisationData.basicData().city());
		jsonObject.addProperty("ror_scraped_at", organisationData.rorScrapedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		jsonObject.add("ror_last_error", JsonNull.INSTANCE);

		Utils.patchAsAdmin(backendUrl + "/organisation?id=eq." + organisationData.basicData().id().toString(), jsonObject.toString());
	}
}
