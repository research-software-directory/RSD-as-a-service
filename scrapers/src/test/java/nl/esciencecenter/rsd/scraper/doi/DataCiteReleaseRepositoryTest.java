// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DataCiteReleaseRepositoryTest {

	@Test
	void givenDoiResponse_whenParsed_thenVersionDoisReturned() {
		// from https://api.datacite.org/dois/10.5281/zenodo.6379973, a large portion was left out
		String response = """
			{
			  "data": {
			    "id": "10.5281/zenodo.6379973",
			    "type": "dois",
			    "relationships": {
			      "versions": {
			        "data": [
			          {
			            "id": "10.5281/zenodo.6379974",
			            "type": "dois"
			          },
			          {
			            "id": "10.5281/zenodo.6782555",
			            "type": "dois"
			          }
			        ]
			      },
			      "versionOf": {
			        "data": [
			          {
			            "id": "10.5281/zenodo.6379973",
			            "type": "dois"
			          }
			        ]
			      }
			    }
			  }
			}""";

		Collection<Doi> versionDois = DataCiteReleaseRepository.parseVersionDois(response);

		Assertions.assertEquals(2, versionDois.size());
		Assertions.assertTrue(versionDois.contains(Doi.fromString("10.5281/zenodo.6379974")));
		Assertions.assertTrue(versionDois.contains(Doi.fromString("10.5281/zenodo.6782555")));
	}
}
