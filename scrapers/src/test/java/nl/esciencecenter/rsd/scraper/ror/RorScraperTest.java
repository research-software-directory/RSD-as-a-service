// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class RorScraperTest {

	@Test
	void testLocations() {
		String completeJsonResponse =
			"{\"id\":\"https://ror.org/04z8jg394\",\"name\":\"Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences\",\"email_address\":\"\",\"ip_addresses\":[],\"established\":1992,\"types\":[\"Facility\"],\"relationships\":[{\"label\":\"Helmholtz Association of German Research Centres\",\"type\":\"Parent\",\"id\":\"https://ror.org/0281dp749\"}],\"addresses\":[{\"lat\":52.39886,\"lng\":13.06566,\"state\":null,\"state_code\":null,\"city\":\"Potsdam\",\"geonames_city\":{\"id\":2852458,\"city\":\"Potsdam\",\"geonames_admin1\":{\"name\":\"Brandenburg\",\"id\":2945356,\"ascii_name\":\"Brandenburg\",\"code\":\"DE.11\"},\"geonames_admin2\":{\"name\":null,\"id\":null,\"ascii_name\":null,\"code\":\"DE.11.00\"},\"license\":{\"attribution\":\"Data from geonames.org under a CC-BY 3.0 license\",\"license\":\"http://creativecommons.org/licenses/by/3.0/\"},\"nuts_level1\":{\"name\":null,\"code\":null},\"nuts_level2\":{\"name\":null,\"code\":null},\"nuts_level3\":{\"name\":null,\"code\":null}},\"postcode\":null,\"primary\":false,\"line\":null,\"country_geonames_id\":2921044}],\"links\":[\"https://www.gfz-potsdam.de\"],\"aliases\":[],\"acronyms\":[\"GFZ\"],\"status\":\"active\",\"wikipedia_url\":\"https://en.wikipedia.org/wiki/GFZ_German_Research_Centre_for_Geosciences\",\"labels\":[{\"label\":\"Helmholtz-Zentrum Potsdam - Deutsches GeoForschungsZentrum GFZ\",\"iso639\":\"de\"}],\"country\":{\"country_name\":\"Germany\",\"country_code\":\"DE\"},\"external_ids\":{\"ISNI\":{\"preferred\":null,\"all\":[\"0000 0000 9195 2461\"]},\"FundRef\":{\"preferred\":\"501100010956\",\"all\":[\"501100010956\"]},\"Wikidata\":{\"preferred\":null,\"all\":[\"Q1205654\"]},\"GRID\":{\"preferred\":\"grid.23731.34\",\"all\":\"grid.23731.34\"}}}";
		RorData rorData = RorScraper.parseV1Data(completeJsonResponse);

		assertEquals("Potsdam", rorData.city());
		assertEquals("Germany", rorData.country());
		assertEquals(List.of("Facility"), rorData.rorTypes());
	}

	@ParameterizedTest
	@ValueSource(
		strings = {
			"{\"addresses\": [{\"city\": null}], \"country\": {\"country_name\": null}}",
			"{\"addresses\": [],\"country\": {}}",
			"{}",
		}
	)
	void testNullLocationsOrEmptyLocationOrEmptyResponse(String jsonBody) {
		RorData rorData = RorScraper.parseV1Data(jsonBody);

		assertNull(rorData.city());
		assertNull(rorData.country());
	}

	// example from https://github.com/ror-community/ror-schema/blob/master/example_record_v2_1.json
	@Test
	void givenExampleJson_whenParsing_thenCorrectDataReturned() {
		String exampleJson = """
			{
			    "locations": [
			        {
			            "geonames_id": 5378538,
			            "geonames_details": {
			                "continent_code": "NA",
			                "continent_name": "North America",
			                "country_code": "US",
			                "country_name": "United States",
			                "country_subdivision_code": "CA",
			                "country_subdivision_name": "California",
			                "lat": 37.802168,
			                "lng": -122.271281,
			                "name": "Oakland"
			            }
			        }
			    ],
			    "established": 1868,
			    "external_ids": [
			        {
			            "type": "fundref",
			            "all": [
			                "100005595",
			                "100009350",
			                "100004802",
			                "100010574",
			                "100005188",
			                "100005192"
			            ],
			            "preferred": "100005595"
			        },
			        {
			            "type": "grid",
			            "all": [
			                "grid.30389.31"
			            ],
			            "preferred": "grid.30389.31"
			        },
			        {
			            "type": "isni",
			            "all": [
			                "0000 0001 2348 0690"
			            ],
			            "preferred": null
			        }
			    ],
			    "id": "https://ror.org/00pjdza24",
			    "domains": [
			        "universityofcalifornia.edu"
			    ],
			    "links": [
			        {
			            "type": "website",
			            "value": "http://www.universityofcalifornia.edu/"
			        },
			        {
			            "type": "wikipedia",
			            "value": "http://en.wikipedia.org/wiki/University_of_California"
			        }
			    ],
			    "names": [
			        {
			            "value": "UC",
			            "types": [
			                "acronym"
			            ],
			            "lang": "en"
			        },
			        {
			            "value": "UC System",
			            "types": [
			                "alias"
			            ],
			            "lang": "en"
			        },
			        {
			            "value": "University of California System",
			            "types": [
			                "ror_display",
			                "label"
			            ],
			            "lang": "en"
			        },
			        {
			            "value": "Université de Californie",
			            "types": [
			                "label"
			            ],
			            "lang": "fr"
			        }
			    ],
			    "relationships": [
			        {
			            "id": "https://ror.org/02jbv0t02",
			            "label": "Lawrence Berkeley National Laboratory",
			            "type": "related"
			        },
			        {
			            "id": "https://ror.org/03yrm5c26",
			            "label": "California Digital Library",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/00zv0wd17",
			            "label": "Center for Information Technology Research in the Interest of Society",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/03t0t6y08",
			            "label": "University of California Division of Agriculture and Natural Resources",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/01an7q238",
			            "label": "University of California, Berkeley",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/05rrcem69",
			            "label": "University of California, Davis",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/04gyf1771",
			            "label": "University of California, Irvine",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/046rm7j60",
			            "label": "University of California, Los Angeles",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/00d9ah105",
			            "label": "University of California, Merced",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/03nawhv43",
			            "label": "University of California, Riverside",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/0168r3w48",
			            "label": "University of California, San Diego",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/043mz5j54",
			            "label": "University of California, San Francisco",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/02t274463",
			            "label": "University of California, Santa Barbara",
			            "type": "child"
			        },
			        {
			            "id": "https://ror.org/03s65by71",
			            "label": "University of California, Santa Cruz",
			            "type": "child"
			        }
			    ],
			    "status": "active",
			    "types": [
			        "education"
			    ],
			    "admin": {
			        "created": {
			            "date": "2020-04-25",
			            "schema_version": "1.0"
			        },
			        "last_modified": {
			            "date": "2022-10-18",
			            "schema_version": "2.0"
			        }
			    }
			}""";

		RorData data = RorScraper.parseV2Data(exampleJson);

		Assertions.assertEquals("United States", data.country());
		Assertions.assertEquals("Oakland", data.city());
		Assertions.assertEquals("http://en.wikipedia.org/wiki/University_of_California", data.wikipediaUrl());
		Assertions.assertEquals(List.of("education"), data.rorTypes());
		Assertions.assertEquals(
			List.of("UC", "UC System", "University of California System", "Université de Californie"),
			data.rorNames()
		);
		Assertions.assertEquals(37.802168, data.lat());
		Assertions.assertEquals(-122.271281, data.lon());
	}
}
