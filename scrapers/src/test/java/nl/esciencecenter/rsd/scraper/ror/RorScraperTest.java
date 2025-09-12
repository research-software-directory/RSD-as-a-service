// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import java.util.List;
import nl.esciencecenter.rsd.scraper.RsdParsingException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class RorScraperTest {

	@Test
	void givenInvalidJson_whenParsing_thenExceptionThrown() {
		Assertions.assertThrowsExactly(RsdParsingException.class, () -> RorScraper.parseV2Data(null));
		Assertions.assertThrowsExactly(RsdParsingException.class, () -> RorScraper.parseV2Data("[]"));
		Assertions.assertThrowsExactly(RsdParsingException.class, () -> RorScraper.parseV2Data("{"));
		Assertions.assertThrowsExactly(RsdParsingException.class, () ->
			RorScraper.parseV2Data("{\"errors\":[\"'test' is not a valid ROR ID\"]}")
		);
		Assertions.assertThrowsExactly(RsdParsingException.class, () ->
			RorScraper.parseV2Data("{\"errors\":[\"ROR ID 'https://ror.org/04tsk2645' does not exist\"]}")
		);
	}

	// example from https://github.com/ror-community/ror-schema/blob/master/example_record_v2_1.json
	@Test
	void givenExampleJson_whenParsing_thenCorrectDataReturned() {
		// editorconfig-checker-disable
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
		// editorconfig-checker-enable

		RorData data = Assertions.assertDoesNotThrow(() -> RorScraper.parseV2Data(exampleJson));

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

	@Test
	void givenHelmholtzJson_whenParsing_thenCorrectDataReturned() {
		// editorconfig-checker-disable
		String exampleJson = """
			{
			   "admin": {
			     "created": {
			       "date": "2018-11-14",
			       "schema_version": "1.0"
			     },
			     "last_modified": {
			       "date": "2025-03-26",
			       "schema_version": "2.1"
			     }
			   },
			   "domains": [
			     "gfz-potsdam.de",
			     "gfz.de"
			   ],
			   "established": 1992,
			   "external_ids": [
			     {
			       "all": [
			         "501100010956"
			       ],
			       "preferred": "501100010956",
			       "type": "fundref"
			     },
			     {
			       "all": [
			         "grid.23731.34"
			       ],
			       "preferred": "grid.23731.34",
			       "type": "grid"
			     },
			     {
			       "all": [
			         "0000 0000 9195 2461"
			       ],
			       "preferred": null,
			       "type": "isni"
			     },
			     {
			       "all": [
			         "Q1205654"
			       ],
			       "preferred": null,
			       "type": "wikidata"
			     }
			   ],
			   "id": "https://ror.org/04z8jg394",
			   "links": [
			     {
			       "type": "website",
			       "value": "https://www.gfz.de"
			     },
			     {
			       "type": "wikipedia",
			       "value": "https://en.wikipedia.org/wiki/GFZ_Helmholtz_Centre_for_Geosciences"
			     }
			   ],
			   "locations": [
			     {
			       "geonames_details": {
			         "continent_code": "EU",
			         "continent_name": "Europe",
			         "country_code": "DE",
			         "country_name": "Germany",
			         "country_subdivision_code": "BB",
			         "country_subdivision_name": "Brandenburg",
			         "lat": 52.39886,
			         "lng": 13.06566,
			         "name": "Potsdam"
			       },
			       "geonames_id": 2852458
			     }
			   ],
			   "names": [
			     {
			       "lang": null,
			       "types": [
			         "acronym"
			       ],
			       "value": "GFZ"
			     },
			     {
			       "lang": "en",
			       "types": [
			         "label",
			         "ror_display"
			       ],
			       "value": "GFZ Helmholtz Centre for Geosciences"
			     },
			     {
			       "lang": "de",
			       "types": [
			         "label"
			       ],
			       "value": "GFZ Helmholtz-Zentrum für Geoforschung"
			     },
			     {
			       "lang": "en",
			       "types": [
			         "alias"
			       ],
			       "value": "Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences"
			     },
			     {
			       "lang": "de",
			       "types": [
			         "alias"
			       ],
			       "value": "Helmholtz-Zentrum Potsdam - Deutsches GeoForschungsZentrum GFZ"
			     }
			   ],
			   "relationships": [
			     {
			       "label": "Research Institute for Sustainability at GFZ",
			       "type": "child",
			       "id": "https://ror.org/01vvnmw35"
			     },
			     {
			       "label": "Helmholtz Association of German Research Centres",
			       "type": "parent",
			       "id": "https://ror.org/0281dp749"
			     }
			   ],
			   "status": "active",
			   "types": [
			     "facility",
			     "funder"
			   ]
			 }""";
		// editorconfig-checker-enable

		RorData data = Assertions.assertDoesNotThrow(() -> RorScraper.parseV2Data(exampleJson));

		Assertions.assertEquals("Germany", data.country());
		Assertions.assertEquals("Potsdam", data.city());
		Assertions.assertEquals(
			"https://en.wikipedia.org/wiki/GFZ_Helmholtz_Centre_for_Geosciences",
			data.wikipediaUrl()
		);
		Assertions.assertEquals(List.of("facility", "funder"), data.rorTypes());
		Assertions.assertEquals(
			List.of(
				"GFZ",
				"GFZ Helmholtz Centre for Geosciences",
				"GFZ Helmholtz-Zentrum für Geoforschung",
				"Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences",
				"Helmholtz-Zentrum Potsdam - Deutsches GeoForschungsZentrum GFZ"
			),
			data.rorNames()
		);
		Assertions.assertEquals(52.39886, data.lat());
		Assertions.assertEquals(13.06566, data.lon());
	}
}
