// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleWork = {
  'doi': '10.1007/978-1-4939-9145-7_4',
  'type': 'BookChapter',
  'types': {
    'resourceType': 'BookChapter'
  },
  'sizes': [],
  'version': null,
  'titles': [
    {
      'title': 'CellProfiler and KNIME: Open-Source Tools for High-Content Screening'
    }
  ],
  'publisher': {
    'name': 'Springer Science and Business Media LLC'
  },
  'publicationYear': 2019,
  'creators': [
    {
      'givenName': 'Martin',
      'familyName': 'Steiter',
      'affiliation': []
    },
    {
      'givenName': 'Antje',
      'familyName': 'Janosch',
      'affiliation': []
    }
  ],
  'contributors': [{
    'givenName': 'Rico',
    'familyName': 'Barsacchi',
    'affiliation': []
  },
  {
    'givenName': 'Marc',
    'familyName': 'Bickle',
    'affiliation': []
  }]
}

export type WorkResponse = typeof exampleWork

export type DataciteWorkGraphQLResponse = {
  data: {
    work: WorkResponse
  }
}

export type DataciteWorksGraphQLResponse = {
  data: {
    works: {
      nodes: WorkResponse[]
    }
  }
}

export type DataciteWorkRestResponse = {
  data: {
    attributes: {
      doi: string,
      registered: string,
      titles: {
        title: string
      }[]
      creators: {
        name: string,
        givenName: string,
        familyName: string,
      }[],
      contributors: {
        name: string,
        givenName: string,
        familyName: string,
      }[],
      publisher: string,
      publicationYear: number,
      types: {
        resourceTypeGeneral: string,
        resourceType: string,
      }
      version: string,
      relatedIdentifiers: {
        relatedIdentifier: string,
        relatedIdentifierType: string,
      }[]
    }
  }
}
