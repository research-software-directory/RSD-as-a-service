// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;

import static com.github.tomakehurst.wiremock.client.WireMock.*;


@WireMockTest(proxyMode = true)
class RorScraperTest {
	
	private static RorScraper rorScraper;
	private static String completeJsonResponse = "{\"id\":\"https://ror.org/04z8jg394\",\"name\":\"Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences\",\"email_address\":\"\",\"ip_addresses\":[],\"established\":1992,\"types\":[\"Facility\"],\"relationships\":[{\"label\":\"Helmholtz Association of German Research Centres\",\"type\":\"Parent\",\"id\":\"https://ror.org/0281dp749\"}],\"addresses\":[{\"lat\":52.39886,\"lng\":13.06566,\"state\":null,\"state_code\":null,\"city\":\"Potsdam\",\"geonames_city\":{\"id\":2852458,\"city\":\"Potsdam\",\"geonames_admin1\":{\"name\":\"Brandenburg\",\"id\":2945356,\"ascii_name\":\"Brandenburg\",\"code\":\"DE.11\"},\"geonames_admin2\":{\"name\":null,\"id\":null,\"ascii_name\":null,\"code\":\"DE.11.00\"},\"license\":{\"attribution\":\"Data from geonames.org under a CC-BY 3.0 license\",\"license\":\"http://creativecommons.org/licenses/by/3.0/\"},\"nuts_level1\":{\"name\":null,\"code\":null},\"nuts_level2\":{\"name\":null,\"code\":null},\"nuts_level3\":{\"name\":null,\"code\":null}},\"postcode\":null,\"primary\":false,\"line\":null,\"country_geonames_id\":2921044}],\"links\":[\"https://www.gfz-potsdam.de\"],\"aliases\":[],\"acronyms\":[\"GFZ\"],\"status\":\"active\",\"wikipedia_url\":\"https://en.wikipedia.org/wiki/GFZ_German_Research_Centre_for_Geosciences\",\"labels\":[{\"label\":\"Helmholtz-Zentrum Potsdam - Deutsches GeoForschungsZentrum GFZ\",\"iso639\":\"de\"}],\"country\":{\"country_name\":\"Germany\",\"country_code\":\"DE\"},\"external_ids\":{\"ISNI\":{\"preferred\":null,\"all\":[\"0000 0000 9195 2461\"]},\"FundRef\":{\"preferred\":\"501100010956\",\"all\":[\"501100010956\"]},\"Wikidata\":{\"preferred\":null,\"all\":[\"Q1205654\"]},\"GRID\":{\"preferred\":\"grid.23731.34\",\"all\":\"grid.23731.34\"}}}";
	private static String apiDomain = "api.ror.org";
	private static String apiPath = "/organizations/04t3en479";

	@Test
	void testLocations() throws Exception {

		stubFor(
			get(apiPath)
			.withHost(WireMock.equalTo(apiDomain))
			.willReturn(
				aResponse()
				.withStatus(200)
				.withBody(completeJsonResponse)
			));
		
		rorScraper = new RorScraper("http://" + apiDomain + apiPath);
		
		assertEquals("Potsdam", rorScraper.city());
		assertEquals("Germany", rorScraper.country());

	}

	@Test
	void testNullLocations() throws Exception {
		stubFor(
			get(apiPath)
			.withHost(WireMock.equalTo(apiDomain))
			.willReturn(
				aResponse()
				.withStatus(200)
				.withBody("{\"addresses\": [{\"city\": null}], \"country\": {\"country_name\": null}}")
			));
		
		rorScraper = new RorScraper("http://" + apiDomain + apiPath);

		assertEquals(null, rorScraper.city());
		assertEquals(null, rorScraper.country());
	}
	
	@Test
	void testEmpyLocations() throws Exception {
		stubFor(
			get(apiPath)
			.withHost(WireMock.equalTo(apiDomain))
			.willReturn(
				aResponse()
				.withStatus(200)
				.withBody("{\"addresses\": [],\"country\": {}}")
			)
		);

		rorScraper = new RorScraper("http://" + apiDomain + apiPath);

		assertEquals(null, rorScraper.city());
		assertEquals(null, rorScraper.country());
	}

	@Test
	void testEmptyResponse() throws Exception {
		stubFor(
			get(apiPath)
			.withHost(WireMock.equalTo(apiDomain))
			.willReturn(
				aResponse()
				.withStatus(200)
				.withBody("{}")
			));
		
		rorScraper = new RorScraper("http://" + apiDomain + apiPath);

		assertEquals(null, rorScraper.city());
		assertEquals(null, rorScraper.country());
	}
}
