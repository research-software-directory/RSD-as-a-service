// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class RorScraper {

	private final RorId rorId;

	public RorScraper(RorId rorId) {
		this.rorId = Objects.requireNonNull(rorId);
	}

	private String getFromApi() throws IOException, InterruptedException, RsdResponseException {
		// e.g https://api.ror.org/organizations/04tsk2644
		return Utils.get(rorId.asApiV1Url().toString());
	}

	public RorData scrapeData() throws RsdResponseException, IOException, InterruptedException {
		String json = getFromApi();
		return parseData(json);
	}

	static RorData parseData(String json) {
		JsonElement jsonElement = JsonParser.parseString(json);
		final String addressesKey = "addresses";

		String country = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonObject("country")
			.getAsJsonPrimitive("country_name")
			.getAsString());
		String city = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray(addressesKey)
			.get(0)
			.getAsJsonObject()
			.getAsJsonPrimitive("city")
			.getAsString());
		String wikipediaUrl = Utils.safelyGetOrNull(jsonElement, j -> {
			JsonElement wikiElement = j
				.getAsJsonObject()
				.get("wikipedia_url");
			return wikiElement.isJsonPrimitive() ? wikiElement.getAsString() : null;
		});
		if (wikipediaUrl != null && wikipediaUrl.isBlank()) {
			wikipediaUrl = null;
		}
		List<String> rorTypes = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray("types")
			.asList()
			.stream()
			.map(JsonElement::getAsString)
			.toList()
		);

		List<String> rorNames = new ArrayList<>();
		List<String> rorAliases = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray("aliases")
			.asList()
			.stream()
			.map(alias -> alias.getAsJsonPrimitive().getAsString())
			.toList()
		);
		if (rorAliases != null) {
			rorNames.addAll(rorAliases);
		}
		List<String> rorAcronyms = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray("acronyms")
			.asList()
			.stream()
			.map(acronym -> acronym.getAsJsonPrimitive().getAsString())
			.toList()
		);
		if (rorAcronyms != null) {
			rorNames.addAll(rorAcronyms);
		}
		List<String> rorLabels = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray("labels")
			.asList()
			.stream()
			.map(label -> label.getAsJsonObject().getAsJsonPrimitive("label").getAsString())
			.toList()
		);
		if (rorLabels != null) {
			rorNames.addAll(rorLabels);
		}

		Double lat = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray(addressesKey)
			.get(0)
			.getAsJsonObject()
			.getAsJsonPrimitive("lat")
			.getAsDouble());
		Double lon = Utils.safelyGetOrNull(jsonElement, j -> j
			.getAsJsonObject()
			.getAsJsonArray(addressesKey)
			.get(0)
			.getAsJsonObject()
			.getAsJsonPrimitive("lng")
			.getAsDouble());

		return new RorData(
			country,
			city,
			wikipediaUrl,
			rorTypes == null ? Collections.emptyList() : rorTypes,
			rorNames,
			lat,
			lon
		);
	}
}
