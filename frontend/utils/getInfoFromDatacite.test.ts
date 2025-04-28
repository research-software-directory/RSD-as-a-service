// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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
  'id': 'https://doi.org/10.5880/riesgos.2021.003',
  'doi': '10.5880/RIESGOS.2021.003',
  'url': 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=bae8fc94-4799-11ec-947f-3811b03e280f',
  'types': {
    'ris': 'COMP',
    'bibtex': 'misc',
    'citeproc': 'article',
    'schemaOrg': 'SoftwareSourceCode',
    'resourceType': 'Software',
    'resourceTypeGeneral': 'Software'
  },
  'creators': [
    {
      'name': 'Pittore, Massimiliano',
      'nameType': 'Personal',
      'givenName': 'Massimiliano',
      'familyName': 'Pittore',
      'affiliation': [
        {
          'name': 'GFZ German Research Centre for Geosciences, Potsdam, Germany',
          'affiliationIdentifierScheme': 'ORCID'
        },
        {
          'name': 'EURAC Research (Accademia Europea): Bolzano, Trentino-Alto Adige, Italy'
        }
      ],
      'nameIdentifiers': [
        {
          'schemeUri': 'https://orcid.org',
          'nameIdentifier': 'https://orcid.org/0000-0003-4940-3444',
          'nameIdentifierScheme': 'ORCID'
        }
      ]
    },
    {
      'name': 'Haas, Michael',
      'nameType': 'Personal',
      'givenName': 'Michael',
      'familyName': 'Haas',
      'affiliation': [
        {
          'name': 'Formerly at GFZ German Research Centre for Geosciences, Potsdam, Germany'
        }
      ],
      'nameIdentifiers': [
        {
          'schemeUri': 'https://orcid.org',
          'nameIdentifier': 'https://orcid.org/0000-0002-1179-1659',
          'nameIdentifierScheme': 'ORCID'
        }
      ]
    }
  ],
  'titles': [
    {
      'title': 'Quakeledger: a web service to serve earthquake scenarios'
    }
  ],
  'publisher': 'GFZ Data Services',
  'container': {},
  'subjects': [
    {
      'subject': 'Earthquake catalogue'
    },
    {
      'subject': 'provider'
    },
    {
      'subject': 'script'
    },
    {
      'subject': 'python'
    },
    {
      'subject': 'RIESGOS'
    },
    {
      'subject': 'Scenario-based multi-risk assessment in the Andes region'
    },
    {
      'subject': 'EARTH SCIENCE SERVICES &gt; DATA ANALYSIS AND VISUALIZATION',
      'subjectScheme': 'NASA/GCMD Earth Science Keywords'
    },
    {
      'subject': 'EARTH SCIENCE SERVICES &gt; DATA MANAGEMENT/DATA HANDLING',
      'subjectScheme': 'NASA/GCMD Earth Science Keywords'
    },
    {
      'subject': 'EARTH SCIENCE SERVICES &gt; WEB SERVICES',
      'subjectScheme': 'NASA/GCMD Earth Science Keywords'
    },
    {
      'subject': 'EARTH SCIENCE SERVICES &gt; WEB SERVICES &gt; DATA PROCESSING SERVICES',
      'subjectScheme': 'NASA/GCMD Earth Science Keywords'
    }
  ],
  'contributors': [
    {
      'name': 'Haas, Michael',
      'nameType': 'Personal',
      'givenName': 'Michael',
      'familyName': 'Haas',
      'affiliation': [
        {
          'name': 'Formerly at GFZ German Research Centre for Geosciences, Potsdam, Germany'
        }
      ],
      'nameIdentifiers': [
        {
          'schemeUri': 'https://orcid.org',
          'nameIdentifier': 'https://orcid.org/0000-0002-1179-1659',
          'nameIdentifierScheme': 'ORCID'
        }
      ]
    },
  ],
  'dates': [
    {
      'date': '2021',
      'dateType': 'Issued'
    }
  ],
  'publicationYear': 2021,
  'identifiers': [],
  'sizes': [],
  'formats': [],
  'version': '1.0',
  'rightsList': [
    {
      'rights': 'BSD 3-Clause "New" or "Revised" License',
      'rightsUri': 'https://opensource.org/licenses/BSD-3-Clause',
      'schemeUri': 'https://spdx.org/licenses/',
      'rightsIdentifier': 'bsd-3-clause',
      'rightsIdentifierScheme': 'SPDX'
    }
  ],
  'descriptions': [
    {
      'description': 'This version of Quakeledger (V.1.0) is a Python3 program that can also be used as a WPS (Web Processing Service). It returns the available earthquake events contained within a given local database (so called catalogue) that must be customised beforehand (e.g. historical, expert and/or stochastic events). This is a rewrite from: https://github.com/GFZ-Centre-for-Early-Warning/quakeledger and https://github.com/bpross-52n/quakeledger. In these original codes, an earthquake catalogue had to be initially provided in .CSV format. The main difference with this version is that, this code is refactored and uses a SQLITE database. The user can find the parser code in: “quakeledger/assistance/import_csv_in_sqlite.py”',
      'descriptionType': 'Abstract'
    },
    {
      'description': 'License: BSD 3-Clause Copyright © 2021 Early Warning and Impact Assessment Group at Helmholtz Centre Potsdam GFZ German Research Centre for Geosciences Quakeledger is free software: you can redistribute it and/or modify it under the terms of the BSD 3-Clause License. Quakeledger is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the BSD 3-Clause License for more details. You should have received a copy of the BSD 3-Clause License along with this program. If not, see',
      'descriptionType': 'Other'
    }
  ],
  'geoLocations': [],
  'fundingReferences': [
    {
      'awardTitle': 'LIENT II – International Partnerships for Sustainable Innovations- RIESGOS',
      'funderName': 'Bundesministerium für Bildung und Forschung',
      'awardNumber': '03G0876',
      'funderIdentifier': 'https://doi.org/10.13039/501100002347',
      'funderIdentifierType': 'Crossref Funder ID'
    }
  ],
  'relatedIdentifiers': [
    {
      'relationType': 'References',
      'relatedIdentifier': '10.1785/0220130087',
      'relatedIdentifierType': 'DOI'
    },
    {
      'relationType': 'References',
      'relatedIdentifier': 'https://www.riesgos.de/en/',
      'relatedIdentifierType': 'URL'
    },
    {
      'relationType': 'IsNewVersionOf',
      'relatedIdentifier': 'https://github.com/GFZ-Centre-for-Early-Warning/quakeledger',
      'relatedIdentifierType': 'URL'
    },
    {
      'relationType': 'IsNewVersionOf',
      'relatedIdentifier': 'https://github.com/bpross-52n/quakeledger',
      'relatedIdentifierType': 'URL'
    },
    {
      'relationType': 'IsVariantFormOf',
      'relatedIdentifier': 'https://github.com/gfzriesgos/quakeledger/',
      'relatedIdentifierType': 'URL'
    }
  ],
  'relatedItems': [],
  'schemaVersion': 'http://datacite.org/schema/kernel-4',
  'providerId': 'gfz',
  'clientId': 'tib.gfz',
  'agency': 'datacite',
  'state': 'findable'
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
      'rights': 'Apache License 2.0',
      'rightsUri': 'http://www.apache.org/licenses/LICENSE-2.0',
      'schemeUri': 'https://spdx.org/licenses/',
      'rightsIdentifier': 'apache-2.0',
      'rightsIdentifierScheme': 'SPDX'
    },
    {
      'rights': 'Open Access',
      'rightsUri': 'info:eu-repo/semantics/openAccess'
    },
    {
      'rights': 'Custom Licenses Open Access',
      'rightsUri': 'https://creativecommons.org/about/open-access/'
    }
  ]
}

const exampleResponseRightsListEmpty = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'rightsList': []
}

it('returns expected contributors', async () => {
  mockResolvedValueOnce(exampleResponse)

  const resp = await getContributorsFromDoi('0', 'DOI')

  expect(resp).toEqual(
    [
      {
        affiliation: 'Example organisation',
        email_address: null,
        family_names: 'Doe',
        given_names: 'John',
        is_contact_person: false,
        orcid: '0000-0000-0000-0000',
        software: '0',
        id: null,
        position: null,
        role: null,
        avatar_id: null,
        account: null
      }
    ]
  )
})

it('returns authors and contributors (without duplicates)', async () => {
  mockResolvedValueOnce(dataciteFullExample)

  const expectedList = [
    {
      given_names: 'Massimiliano',
      family_names: 'Pittore',
      email_address: null,
      software: '0',
      affiliation: 'GFZ German Research Centre for Geosciences, Potsdam, Germany',
      is_contact_person: false,
      orcid: '0000-0003-4940-3444',
      id: null,
      position: null,
      role: null,
      avatar_id: null,
      account: null
    },
    {
      given_names: 'Michael',
      family_names: 'Haas',
      email_address: null,
      software: '0',
      affiliation: 'Formerly at GFZ German Research Centre for Geosciences, Potsdam, Germany',
      is_contact_person: false,
      orcid: '0000-0002-1179-1659',
      id: null,
      position: null,
      role: null,
      avatar_id: null,
      account: null
    }
  ]
  const resp = await getContributorsFromDoi('0', 'DOI')
  expect(resp).toEqual(expectedList)
})

it('skips invalid persons', async () => {
  mockResolvedValueOnce(exampleResponseInvalidPersons)
  const resp = await getContributorsFromDoi('0', 'DOI')
  expect(resp).toEqual([])
})

it('returns expected keywords', async () => {
  mockResolvedValueOnce(dataciteFullExample)
  const resp = await getKeywordsFromDoi('0')
  const expected = [
    'Earthquake catalogue',
    'provider',
    'script',
    'python',
    'RIESGOS',
    'Scenario-based multi-risk assessment in the Andes region',
    'EARTH SCIENCE SERVICES &gt; DATA ANALYSIS AND VISUALIZATION',
    'EARTH SCIENCE SERVICES &gt; DATA MANAGEMENT/DATA HANDLING',
    'EARTH SCIENCE SERVICES &gt; WEB SERVICES',
    'EARTH SCIENCE SERVICES &gt; WEB SERVICES &gt; DATA PROCESSING SERVICES'
  ]
  expect(resp).toEqual(expected)
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

it('returns ONLY licenses having rightsUri starting with http', async () => {
  mockResolvedValueOnce(exampleResponseRightsList)
  const resp = await getLicensesFromDoi('0')
  expect(resp).toEqual([{
    'name': 'Apache License 2.0',
    'reference': 'http://www.apache.org/licenses/LICENSE-2.0',
    'key': 'apache-2.0',
  },{
    'key': null,
    'name': 'Custom Licenses Open Access',
    'reference': 'https://creativecommons.org/about/open-access/'
  }])
})

