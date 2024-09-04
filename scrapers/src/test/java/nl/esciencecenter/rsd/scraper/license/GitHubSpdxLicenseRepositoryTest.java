// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.license;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Map;

class GitHubSpdxLicenseRepositoryTest {

	@Test
	void parseLicensesJson() {
		// editorconfig-checker-disable
		String json = """
			{
			  "licenseListVersion": "779bbe0",
			  "licenses": [
			    {
			      "reference": "https://spdx.org/licenses/0BSD.html",
			      "isDeprecatedLicenseId": false,
			      "detailsUrl": "https://spdx.org/licenses/0BSD.json",
			      "referenceNumber": 16,
			      "name": "BSD Zero Clause License",
			      "licenseId": "0BSD",
			      "seeAlso": [
			        "http://landley.net/toybox/license.html",
			        "https://opensource.org/licenses/0BSD"
			      ],
			      "isOsiApproved": true
			    },
			    {
				  "reference": "https://spdx.org/licenses/MIT.html",
				  "isDeprecatedLicenseId": false,
				  "detailsUrl": "https://spdx.org/licenses/MIT.json",
				  "referenceNumber": 535,
				  "name": "MIT License",
				  "licenseId": "MIT",
				  "seeAlso": [
					"https://opensource.org/license/mit/"
				  ],
				  "isOsiApproved": true,
				  "isFsfLibre": true
				},
				{
				  "reference": "https://spdx.org/licenses/CC-BY-4.0.html",
				  "isDeprecatedLicenseId": false,
				  "detailsUrl": "https://spdx.org/licenses/CC-BY-4.0.json",
				  "referenceNumber": 578,
				  "name": "Creative Commons Attribution 4.0 International",
				  "licenseId": "CC-BY-4.0",
				  "seeAlso": [
					"https://creativecommons.org/licenses/by/4.0/legalcode"
				  ],
				  "isOsiApproved": false,
				  "isFsfLibre": true
				}
			  ],
			  "releaseDate": "2024-10-10"
			}""";
		// editorconfig-checker-enable

		Map<String, SpdxLicense> licenseMap = Assertions.assertDoesNotThrow(() -> GitHubSpdxLicenseRepository.parseLicensesJson(json));
		Assertions.assertEquals(3, licenseMap.size());
		Assertions.assertTrue(licenseMap.containsKey("0BSD"));
		Assertions.assertTrue(licenseMap.containsKey("MIT"));
		Assertions.assertTrue(licenseMap.containsKey("CC-BY-4.0"));

		SpdxLicense bsdZero = licenseMap.get("0BSD");
		Assertions.assertEquals("0BSD", bsdZero.licenseId());
		Assertions.assertEquals("https://spdx.org/licenses/0BSD.html", bsdZero.reference());
		Assertions.assertEquals("BSD Zero Clause License", bsdZero.name());

		SpdxLicense mit = licenseMap.get("MIT");
		Assertions.assertEquals("MIT", mit.licenseId());
		Assertions.assertEquals("https://spdx.org/licenses/MIT.html", mit.reference());
		Assertions.assertEquals("MIT License", mit.name());
	}
}
