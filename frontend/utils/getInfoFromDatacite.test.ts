
import {mockResolvedValueOnce} from './jest/mockFetch'
import {
  getContributorsFromDoi,
  getKeywordsFromDoi,
  getLicensesFromDoi,
} from './getInfoFromDatacite'

const exampleCreator = {
  'name': 'Doe, John',
  'nameType': 'Personal',
  'givenName': 'John',
  'familyName': 'Doe',
  'affiliation': [
    {
      'name': 'Example organisation'
    },
    {
      'name': 'Second example organisation'
    }
  ],
  'nameIdentifiers': [
    {
      'schemeUri': 'https://orcid.org',
      'nameIdentifier': 'https://orcid.org/0000-0000-0000-0000',
      'nameIdentifierScheme': 'ORCID'
    },
    {
      'schemeUri': 'TEST',
      'nameIdentifier': 'TEST',
      'nameIdentifierScheme': 'TEST'
    }
  ]
}

const exampleResponse = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'types': {
    'ris': 'COMP',
    'bibtex': 'misc',
    'citeproc': 'article',
    'schemaOrg': 'SoftwareSourceCode',
    'resourceTypeGeneral': 'Software'
  },
  'creators': [
    exampleCreator,
  ],
  'titles': [
    {
      'title': 'Example Title v0.0.0'
    }
  ],
  'publisher': 'Zenodo',
  'container': {},
  'subjects': [],
  'contributors': [],
  'dates': [
    {
      'date': '2021-10-16',
      'dateType': 'Issued'
    }
  ],
  'publicationYear': 2021,
  'identifiers': [
    {
      'identifier': 'https://zenodo.org/record/0000000',
      'identifierType': 'URL'
    }
  ],
  'sizes': [
    '8461 Bytes'
  ],
  'formats': [],
  'version': 'v0.0.0',
  'rightsList': [
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess',
      'schemeUri': 'https://spdx.org/licenses/',
      'rightsIdentifier': 'cc-by-4.0',
      'rightsIdentifierScheme': 'SPDX'
    }
  ],
  'descriptions': [
    {
      'description': 'Example description',
      'descriptionType': 'Abstract',
    }
  ],
  'geoLocations': [],
  'fundingReferences': [],
  'relatedIdentifiers': [
    {
      'relationType': 'IsSupplementTo',
      'relatedIdentifier': 'https://github.com/github/software/tree/v0.0.0',
      'relatedIdentifierType': 'URL'
    },
  ],
  'relatedItems': [],
  'schemaVersion': 'http://datacite.org/schema/kernel-4',
  'providerId': 'cern',
  'clientId': 'cern.zenodo',
  'agency': 'datacite',
  'state': 'findable'
}

// taken from (and slightly modified):
// https://github.com/inveniosoftware/datacite/blob/b15db91e1231135e5f2dba0cadca0c72ede037cf/tests/data/datacite-v4.1-full-example.json
const dataciteFullExample = {
  'identifier': {
    'identifier': '10.1234/example-full',
    'identifierType': 'DOI'
  },
  'creators': [
    {
      'creatorName': 'Miller, Elizabeth',
      'nameType': 'Personal',
      'givenName': 'Elizabeth',
      'familyName': 'Miller',
      'nameIdentifiers': [
        {
          'nameIdentifier': '0000-0000-0000-0000',
          'nameIdentifierScheme': 'ORCID',
          'schemeURI': 'http://orcid.org/'
        },
        {
          'nameIdentifier': '0000-0000-0000-0001',
          'nameIdentifierScheme': 'ORCID',
          'schemeURI': 'http://orcid.org/'
        }
      ],
      'affiliation': ['DataCite', 'CERN', 'TIND']
    }
  ],
  'titles': [
    {
      'title': 'Full DataCite XML Example',
      'lang': 'en-us'
    },
    {
      'title': 'Demonstration of DataCite Properties.',
      'titleType': 'Subtitle',
      'lang': 'en-us'
    }
  ],
  'publisher': 'DataCite',
  'publicationYear': '2014',
  'subjects': [
    {
      'subject': '000 computer science',
      'subjectScheme': 'dewey',
      'valueURI': 'https://cern.ch',
      'schemeURI': 'http://dewey.info/',
      'lang': 'en-us'
    }
  ],
  'contributors': [
    {
      'contributorName': 'Starr, Joan',
      'nameType': 'Personal',
      'contributorType': 'ProjectLeader',
      'givenName': 'Joan',
      'familyName': 'Starr',
      'nameIdentifiers': [
        {
          'nameIdentifier': '1000-0000-0000-000X',
          'nameIdentifierScheme': 'ORCID',
          'schemeURI': 'http://orcid.org/'
        }
      ],
      'affiliation': ['California Digital Library']
    }
  ],
  'dates': [
    {
      'date': '2014-10-17',
      'dateType': 'Updated',
      'dateInformation': 'Date of the first publishing.'
    }
  ],
  'language': 'en-us',
  'resourceType': {
    'resourceTypeGeneral': 'Software',
    'resourceType': 'XML'
  },
  'alternateIdentifiers': [
    {
      'alternateIdentifier': 'http://schema.datacite.org/schema/meta/kernel-4.1/example/datacite-example-full-v4.1.xml',
      'alternateIdentifierType': 'URL'
    }
  ],
  'relatedIdentifiers': [
    {
      'relatedIdentifier': 'http://data.datacite.org/application/citeproc+json/10.1234/example-full',
      'relatedIdentifierType': 'URL',
      'relationType': 'HasMetadata',
      'relatedMetadataScheme': 'citeproc+json',
      'schemeURI': 'https://github.com/citation-style-language/schema/raw/master/csl-data.json'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0001',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'IsReviewedBy'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0002',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'IsDescribedBy',
      'resourceTypeGeneral': 'Text'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0003',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'Describes'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0004',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'IsVersionOf'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0005',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'HasVersion'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0006',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'IsRequiredBy'
    },
    {
      'relatedIdentifier': 'arXiv:0706.0007',
      'relatedIdentifierType': 'arXiv',
      'relationType': 'Requires'
    }
  ],
  'sizes': [
    '3KB'
  ],
  'formats': [
    'application/xml'
  ],
  'version': '4.1',
  'rightsList': [
    {
      'rights': 'CC0 1.0 Universal',
      'rightsURI': 'http://creativecommons.org/publicdomain/zero/1.0/',
      'lang': 'en-us'
    }
  ],
  'descriptions': [
    {
      'descriptionType': 'Abstract',
      'lang': 'en-us',
      'description': 'XML example of all DataCite Metadata Schema v4.1 properties.'
    }
  ],
  'fundingReferences': [
    {
      'funderName': 'European Commission',
      'funderIdentifier': {
        'funderIdentifier': 'http://doi.org/10.13039/501100000780',
        'funderIdentifierType': 'Crossref Funder ID'
      },
      'awardNumber': {
        'awardNumber': '282625',
        'awardURI': 'http://cordis.europa.eu/project/rcn/100180_en.html'
      },
      'awardTitle': 'MOTivational strength of ecosystem services and alternative ways to express the value of BIOdiversity'
    },
    {
      'funderName': 'European Commission',
      'funderIdentifier': {
        'funderIdentifier': 'http://doi.org/10.13039/501100000780',
        'funderIdentifierType': 'Crossref Funder ID'
      },
      'awardNumber': {
        'awardNumber': '284382',
        'awardURI': 'http://cordis.europa.eu/project/rcn/100603_en.html'
      },
      'awardTitle': 'Institutionalizing global genetic-resource commons. Global Strategies for accessingand using essential public knowledge assets in the life science'
    }
  ],
  'geoLocations': [
    {
      'geoLocationPoint': {
        'pointLongitude': 31.233,
        'pointLatitude': -67.302
      },
      'geoLocationBox': {
        'westBoundLongitude': -71.032,
        'eastBoundLongitude': -68.211,
        'southBoundLatitude': 41.090,
        'northBoundLatitude': 42.893
      },
      'geoLocationPlace': 'Atlantic Ocean',
      'geoLocationPolygons': [
        {
          'polygonPoints': [
            {
              'pointLongitude': -71.032,
              'pointLatitude': 41.090
            },
            {
              'pointLongitude': -68.211,
              'pointLatitude': 42.893
            },
            {
              'pointLongitude': -72.032,
              'pointLatitude': 39.090
            },
            {
              'pointLongitude': -71.032,
              'pointLatitude': 41.090
            }
          ]
        },
        {
          'polygonPoints': [
            {
              'pointLongitude': -72.032,
              'pointLatitude': 42.090
            },
            {
              'pointLongitude': -69.211,
              'pointLatitude': 43.893
            },
            {
              'pointLongitude': -73.032,
              'pointLatitude': 41.090
            },
            {
              'pointLongitude': -72.032,
              'pointLatitude': 42.090
            }
          ],
          'inPolygonPoint': {
            'pointLongitude': -52.032,
            'pointLatitude': 12.090
          }
        }
      ]
    }
  ]
}

const exampleResponseInvalidPersons = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'creators': [
    {
      'name': 'Test',
      'givenName': 'Test'
    },
    {
      'name': 'Test',
      'familyName': 'Test'
    },
    {
      'name': 'Test'
    }
  ],
  'contributors': [
    {
      'name': 'Test',
      'givenName': 'Test'
    },
    {
      'name': 'Test',
      'familyName': 'Test'
    },
    {
      'name': 'Test'
    }
  ]
}

const exampleResponseNoInfo = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000'
}

const exampleResponseInvalidSubjects = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'subjects': [
    {
      'test': 'Test',
      'invalid': 'Test'
    },
    {
      'subjectScheme': 'Test',
      'valueURI': 'Test'
    },
    {
      'schemeURI': 'Test',
      'lang': 'Test'
    }
  ]
}

const exampleResponseRightsList = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'rightsList': [
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess',
      'schemeUri': 'https://spdx.org/licenses/',
      'rightsIdentifier': 'cc-by-4.0',
      'rightsIdentifierScheme': 'SPDX'
    },
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess'
    },
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess',
      'schemeUri': 'https://spdx.org/licenses/',
      'rightsIdentifier': 'EUPL-1.2',
      'rightsIdentifierScheme': 'SPDX'
    },
  ]
}

const exampleResponseRightsListEmpty = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'rightsList': []
}

const exampleResponseRightsListNoSpdx = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'rightsList': [
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess'
    }
  ]
}

it('returns expected contributors', async () => {
  mockResolvedValueOnce(exampleResponse)

  const resp = await getContributorsFromDoi('0', 'DOI')

  expect(resp).toEqual(
    [
      {
        'affiliation': 'Example organisation',
        'email_address': '',
        'family_names': 'Doe',
        'given_names': 'John',
        'is_contact_person': false,
        'orcid': '0000-0000-0000-0000',
        'software': '0'
      }
    ]
  )
})

it('returns authors and contributors', async () => {
  mockResolvedValueOnce(dataciteFullExample)

  const resp = await getContributorsFromDoi('0', 'DOI')

  expect(resp).toEqual(
    [
      {
        'affiliation': 'DataCite',
        'email_address': '',
        'family_names': 'Miller',
        'given_names': 'Elizabeth',
        'is_contact_person': false,
        'orcid': '0000-0000-0000-0000',
        'software': '0'
      },
      {
        'affiliation': 'California Digital Library',
        'email_address': '',
        'family_names': 'Starr',
        'given_names': 'Joan',
        'is_contact_person': false,
        'orcid': '1000-0000-0000-000X',
        'software': '0'
      }
    ]
  )
})

it('skips invalid persons', async () => {
  mockResolvedValueOnce(exampleResponseInvalidPersons)
  const resp = await getContributorsFromDoi('0', 'DOI')
  expect(resp).toEqual([])
})

it('returns expected keywords', async () => {
  mockResolvedValueOnce(dataciteFullExample)
  const resp = await getKeywordsFromDoi('0')
  expect(resp).toEqual(['000 computer science'])
})

it('returns no keywords if there are none', async () => {
  mockResolvedValueOnce(exampleResponse)
  const resp = await getKeywordsFromDoi('0')
  expect(resp).toEqual([])
})

it('returns no keywords if subjects is missing', async () => {
  mockResolvedValueOnce(exampleResponseNoInfo)
  const resp = await getKeywordsFromDoi('0')
  expect(resp).toEqual([])
})

it('skips invalid keyword subjects', async () => {
  mockResolvedValueOnce(exampleResponseInvalidSubjects)
  const resp = await getKeywordsFromDoi('0')
  expect(resp).toEqual([])
})

it('returns all licenses from rightsList', async () => {
  mockResolvedValueOnce(exampleResponseRightsList)
  const resp = await getLicensesFromDoi('0')
  expect(resp).toEqual(['cc-by-4.0', 'Open Access','EUPL-1.2'])
})

it('returns no licenses if rightsList is missing', async () => {
  mockResolvedValueOnce(exampleResponseNoInfo)
  const resp = await getLicensesFromDoi('0')
  expect(resp).toEqual([])
})

it('returns no licenses if rightsList is empty', async () => {
  mockResolvedValueOnce(exampleResponseRightsListEmpty)
  const resp = await getLicensesFromDoi('0')
  expect(resp).toEqual([])
})

// we want to return any type of licenses registered in DOI
// it('returns only SPDX licenses', async () => {
//   mockResolvedValueOnce(exampleResponseRightsListNoSpdx)
//   const resp = await getLicensesFromDoi('0')
//   expect(resp).toEqual([])
// })
