// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
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
import java.util.List;
import java.util.UUID;

public class RorPostgrestConnector {
	private final String backendUrl;

	public RorPostgrestConnector() {
		this.backendUrl = Config.backendBaseUrl();
	}

	public Collection<OrganisationDatabaseData> organisationsWithoutLocation(int limit) {
		String filter = "organisation?ror_id=not.is.null&order=ror_scraped_at.asc.nullsfirst&select=id,ror_id&limit=" + limit;
		String data = Utils.getAsAdmin(backendUrl + "/" + filter);
		return parseBasicJsonData(data);
	}

	static Collection<OrganisationDatabaseData> parseBasicJsonData(String data) {
		JsonArray dataInArray = JsonParser.parseString(data).getAsJsonArray();
		Collection<OrganisationDatabaseData> result = new ArrayList<>();
		for (JsonElement element : dataInArray) {
			JsonObject organisationJson = element.getAsJsonObject();
			UUID id = UUID.fromString(organisationJson.getAsJsonPrimitive("id").getAsString());
			RorId rorId = RorId.fromUrlString(organisationJson.getAsJsonPrimitive("ror_id").getAsString());
			result.add(new OrganisationDatabaseData(id, rorId, null, null));
		}
		return result;
	}

	public void saveLocationData(OrganisationDatabaseData organisationData) {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("country", organisationData.data().country());
		jsonObject.addProperty("city", organisationData.data().city());
		jsonObject.addProperty("wikipedia_url", organisationData.data().wikipediaUrl());

		JsonArray rorTypesJsonArray = new JsonArray();
		List<String> rorTypes = organisationData.data().rorTypes();
		if (rorTypes != null) {
			for (String rorType : rorTypes) {
				rorTypesJsonArray.add(rorType);
			}
		}
		jsonObject.add("ror_types", rorTypesJsonArray);

		JsonArray rorNamesJsonArray = new JsonArray();
		List<String> rorNames = organisationData.data().rorNames();
		if (rorNames != null) {
			for (String rorName : rorNames) {
				rorNamesJsonArray.add(rorName);
			}
		}
		jsonObject.add("ror_names", rorNamesJsonArray);

		jsonObject.addProperty("lat", organisationData.data().lat());
		jsonObject.addProperty("lon", organisationData.data().lon());

		jsonObject.addProperty("ror_scraped_at", organisationData.rorScrapedAt()
			.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		jsonObject.add("ror_last_error", JsonNull.INSTANCE);

		Utils.patchAsAdmin(backendUrl + "/organisation?id=eq." + organisationData.id(), jsonObject.toString());
	}
}
