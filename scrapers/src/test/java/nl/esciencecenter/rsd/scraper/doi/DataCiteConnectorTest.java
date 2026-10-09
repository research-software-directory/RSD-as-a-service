// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.time.ZonedDateTime;
import java.util.Collection;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DataCiteConnectorTest {

	@Test
	void givenDoiResponse_whenParsingVersionDois_thenVersionDoisReturned() {
		// from https://api.datacite.org/dois/10.5281/zenodo.6379973, a large portion was left out
		// editorconfig-checker-disable
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
		// editorconfig-checker-enable

		Collection<Doi> versionDois = DataciteConnector.DataciteParser.parseVersionDois(response);

		Assertions.assertEquals(2, versionDois.size());
		Assertions.assertTrue(versionDois.contains(Doi.fromString("10.5281/zenodo.6379974")));
		Assertions.assertTrue(versionDois.contains(Doi.fromString("10.5281/zenodo.6782555")));
	}

	@Test
	void givenDoiResponse_whenParsingAsMention_thenMentionReturned() {
		// from https://api.datacite.org/dois/10.5281/zenodo.6379973, some data was left out
		// editorconfig-checker-disable
		String response = """
		{
		  "data": {
		    "id": "10.5281/zenodo.3877116",
		    "type": "dois",
		    "attributes": {
		      "doi": "10.5281/zenodo.3877116",
		      "prefix": "10.5281",
		      "suffix": "zenodo.3877116",
		      "identifiers": [
		        {
		          "identifier": "https://zenodo.org/record/5898417",
		          "identifierType": "URL"
		        }
		      ],
		      "alternateIdentifiers": [
		        {
		          "alternateIdentifierType": "URL",
		          "alternateIdentifier": "https://zenodo.org/record/5898417"
		        }
		      ],
		      "creators": [
		        {
		          "name": "Hidding, Johan",
		          "givenName": "Johan",
		          "familyName": "Hidding",
		          "affiliation": [
		            "Netherlands eScience Center"
		          ],
		          "nameIdentifiers": [
		            {
		              "schemeUri": "https://orcid.org",
		              "nameIdentifier": "https://orcid.org/0000-0002-7550-1796",
		              "nameIdentifierScheme": "ORCID"
		            }
		          ]
		        }
		      ],
		      "titles": [
		        {
		          "title": "Entangled"
		        }
		      ],
		      "publisher": "Zenodo",
		      "container": {},
		      "publicationYear": 2022,
		      "subjects": [
		        {
		          "subject": "Literate Programming"
		        }
		      ],
		      "contributors": [],
		      "dates": [
		        {
		          "date": "2022-01-24",
		          "dateType": "Issued"
		        }
		      ],
		      "language": null,
		      "types": {
		        "ris": "COMP",
		        "bibtex": "misc",
		        "citeproc": "article",
		        "schemaOrg": "SoftwareSourceCode",
		        "resourceTypeGeneral": "Software"
		      },
		      "relatedIdentifiers": [
		        {
		          "relationType": "IsSupplementTo",
		          "relatedIdentifier": "https://github.com/entangled/entangled/tree/v1.3.0",
		          "relatedIdentifierType": "URL"
		        },
		        {
		          "relationType": "HasVersion",
		          "relatedIdentifier": "10.5281/zenodo.3877117",
		          "relatedIdentifierType": "DOI"
		        },
		        {
		          "relationType": "HasVersion",
		          "relatedIdentifier": "10.5281/zenodo.3885761",
		          "relatedIdentifierType": "DOI"
		        },
		        {
		          "relationType": "HasVersion",
		          "relatedIdentifier": "10.5281/zenodo.5898417",
		          "relatedIdentifierType": "DOI"
		        }
		      ],
		      "relatedItems": [],
		      "sizes": [],
		      "formats": [],
		      "version": "v1.3.0",
		      "rightsList": [
		        {
		          "rights": "Apache License 2.0",
		          "rightsUri": "http://www.apache.org/licenses/LICENSE-2.0",
		          "schemeUri": "https://spdx.org/licenses/",
		          "rightsIdentifier": "apache-2.0",
		          "rightsIdentifierScheme": "SPDX"
		        },
		        {
		          "rights": "Open Access",
		          "rightsUri": "info:eu-repo/semantics/openAccess"
		        }
		      ],
		      "descriptions": [
		        {
		          "description": "Literate programming is a programming paradigm introduced by Donald Knuth in which a program is given as an explanation of the program logic in a natural language, such as English, interspersed with snippets of macros and traditional source code, from which a compilable source code can be generated. Entangled makes writing literate programs easier by keeping code blocks in Markdown up-to-date with generated source files. By monitoring the tangled source files, any change in the master document or source files is reflected in the other.",
		          "descriptionType": "Abstract"
		        }
		      ],
		      "geoLocations": [],
		      "fundingReferences": [],
		      "url": "https://zenodo.org/record/3877116",
		      "contentUrl": null,
		      "metadataVersion": 2,
		      "schemaVersion": "http://datacite.org/schema/kernel-4",
		      "source": "mds",
		      "isActive": true,
		      "state": "findable",
		      "reason": null,
		      "viewCount": 0,
		      "viewsOverTime": [],
		      "downloadCount": 0,
		      "downloadsOverTime": [],
		      "referenceCount": 0,
		      "citationCount": 0,
		      "citationsOverTime": [],
		      "partCount": 0,
		      "partOfCount": 0,
		      "versionCount": 3,
		      "versionOfCount": 0,
		      "created": "2020-06-04T17:15:18.000Z",
		      "registered": "2020-06-04T17:15:19.000Z",
		      "published": "2022",
		      "updated": "2022-01-24T15:40:07.000Z"
		    },
		    "relationships": {
		      "client": {
		        "data": {
		          "id": "cern.zenodo",
		          "type": "clients"
		        }
		      },
		      "provider": {
		        "data": {
		          "id": "cern",
		          "type": "providers"
		        }
		      },
		      "media": {
		        "data": {
		          "id": "10.5281/zenodo.3877116",
		          "type": "media"
		        }
		      },
		      "references": {
		        "data": []
		      },
		      "citations": {
		        "data": []
		      },
		      "parts": {
		        "data": []
		      },
		      "partOf": {
		        "data": []
		      },
		      "versions": {
		        "data": [
		          {
		            "id": "10.5281/zenodo.5898417",
		            "type": "dois"
		          },
		          {
		            "id": "10.5281/zenodo.3885761",
		            "type": "dois"
		          },
		          {
		            "id": "10.5281/zenodo.3877117",
		            "type": "dois"
		          }
		        ]
		      },
		      "versionOf": {
		        "data": []
		      }
		    }
		  }
		}""";
		// editorconfig-checker-enable

		ExternalMentionRecord mention = Assertions.assertDoesNotThrow(() ->
			DataciteConnector.DataciteParser.parseMention(response)
		);

		Assertions.assertEquals(Doi.fromString("10.5281/zenodo.3877116"), mention.doi());
		Assertions.assertEquals("Entangled", mention.title());
		Assertions.assertEquals("Johan Hidding", mention.authors());
		Assertions.assertEquals("DataCite", mention.source());
		Assertions.assertEquals("v1.3.0", mention.version()); // from a related Git URL
		Assertions.assertEquals(2022, mention.publicationYear());
		Assertions.assertEquals(ZonedDateTime.parse("2020-06-04T17:15:19.000Z"), mention.doiRegistrationDate());
	}
}
