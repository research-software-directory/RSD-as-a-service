// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.ror;

import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RorPostgrestConnectorTest {

	@Test
	void testParseBasicJsonData() {
		String data = "[{\"id\":\"52b13a36-334b-429a-9cbb-5215264b36d2\",\"parent\":null,\"primary_maintainer\":\"22f87e87-7fd9-4716-9dc6-e790372cac4c\",\"slug\":\"gfz\",\"name\":\"Helmholtz Centre Potsdam GFZ German Research Centre for Geosciences\",\"ror_id\":\"https://ror.org/04z8jg394\",\"website\":\"https://www.gfz-potsdam.de\",\"is_tenant\":true,\"created_at\":\"2022-07-26T19:34:55.173342+00:00\",\"updated_at\":\"2023-05-17T06:11:51.338233+00:00\",\"description\":\"# About GFZ Potsdam\n\nThe GFZ is Germany’s national research center for the solid Earth Sciences. Our mission is to deepen the knowledge of the dynamics of the solid Earth, and to develop solutions for grand challenges facing society. These challenges include anticipating the hazards arising from the Earth’s dynamic systems and mitigating the associated risks to society; securing our habitat under the pressure of global change; and supplying energy and mineral resources for a rapidly growing population in a sustainable manner and without harming the environment. \n\n## Research Software at GFZ\n\nTo learn more about the research software policy at GFZ, visit [gfz-potsdam.de/en/software](https://www.gfz-potsdam.de/en/software).\n\n\",\"logo_id\":\"da40b40113fdfb1d3ce40f58ecb784fe33ba40bb\",\"country\":null,\"city\":null,\"short_description\":null}]";

		Collection<OrganisationDatabaseData> result = RorPostgrestConnector.parseBasicJsonData(data);
		assertEquals(1, result.size());

		OrganisationDatabaseData organisation = result.iterator().next();
		assertEquals(UUID.fromString("52b13a36-334b-429a-9cbb-5215264b36d2"), organisation.id());
		assertEquals(RorId.fromUrlString("https://ror.org/04z8jg394"), organisation.rorId());
		assertNull(organisation.data());
	}
}
