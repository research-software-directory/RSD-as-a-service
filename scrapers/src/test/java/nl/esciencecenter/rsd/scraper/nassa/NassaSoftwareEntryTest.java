// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.nassa;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.StringReader;

class NassaSoftwareEntryTest {

	@Test
	void givenValidNassaYaml_whenParsing_thenSoftwareEntryReturned() {
		// editorconfig-checker-disable
		String validYaml = """
			id: 2022-Verhagen-001
			nassaVersion: 0.5.0
			moduleType: Algorithm
			title: Determine fertility rates for use in a demographic simulation.
			moduleVersion: 1.0.1
			contributors:
			 - name: Verhagen, Philip
			   roles: [ "Author", "Copyright Holder", "Creator" ]
			   email: j.w.h.p.verhagen@vu.nl
			   orcid: 0000-0001-8166-122X
			lastUpdateDate: 2022-12-02
			description: >
			  This NetLogo code snippet provides fertility estimates of females for use in demographic simulations. The figures used are based on two different sources, and will be assigned per 5-year age cohort.
			relatedModules:\s
			references:
			  moduleReferences: [ Bagnall-Frier-1994, Coale-Trussell-1974, Coale-Trussell-1978, Henry-1961, Verhagen-2022 ]
			domainKeywords:
			  regions:\s
			  periods:\s
			    - Roman period
			    - Modern period
			  subjects:\s
			    - demography
			    - fertility
			modellingKeywords:
			  - parameter initialisation
			programmingKeywords:
			  - Functional
			  - Object-Oriented
			implementations:
			  - language: NetLogo
			    softwareDependencies:\s
			    - NetLogo 6.2.0
			docsDir: documentation/
			license: MIT
			""";
		// editorconfig-checker-enable

		NassaSoftwareEntry entry = NassaSoftwareEntry.fromYaml(new StringReader(validYaml), "https://github.com/Archaeology-ABM/NASSA-modules/tree/main/2022-Verhagen-001", null);

		Assertions.assertNotNull(entry);
		Assertions.assertEquals("Determine fertility rates for use in a demographic simulation.", entry.title);
		Assertions.assertEquals("1.0.1", entry.moduleVersion);
	}
}
