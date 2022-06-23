// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Map;

public class MainMentionsTest {


	@Test
	void givenValidDoiSourceData_whenParsing_thenMapReturned() {
		String validDoiSourceData = """
				[
				  {
				    "DOI": "10.5240/B1FA-0EEC-C316-3316-3A73-L",
				    "RA": "EIDR"
				  },
				  {
				    "DOI": "notADoi",
				    "status": "Invalid DOI"
				  },
				  {
				    "DOI": "10.5281/zenodo.1436372",
				    "RA": "DataCite"
				  },
				  {
				    "DOI": "10.5281/zenodo.2633819",
				    "RA": "DataCite"
				  },
				  {
				    "DOI": "10.5281/zenodo.5825192",
				    "RA": "DataCite"
				  },
				  {
				    "DOI": "10.35802/218300",
				    "RA": "Crossref"
				  }
				]""";

		Map<String, String> doiToSource = MainMentions.parseJsonSources(validDoiSourceData);
		Assertions.assertEquals(6, doiToSource.size());
		Assertions.assertEquals("EIDR", doiToSource.get("10.5240/B1FA-0EEC-C316-3316-3A73-L"));
		Assertions.assertEquals("Invalid DOI", doiToSource.get("notADoi"));
		Assertions.assertEquals("DataCite", doiToSource.get("10.5281/zenodo.1436372"));
		Assertions.assertEquals("DataCite", doiToSource.get("10.5281/zenodo.2633819"));
		Assertions.assertEquals("DataCite", doiToSource.get("10.5281/zenodo.5825192"));
		Assertions.assertEquals("Crossref", doiToSource.get("10.35802/218300"));
	}
}
