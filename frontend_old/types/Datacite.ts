// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type DoiPerson = {
  'name': string
  'givenName': string
  'familyName': string
  'affiliation': string[]
}

type DoiAttributes = {
  doi: string,
  creators: DoiPerson[]
  contributors: DoiPerson[]
  titles: [
    {title:string}
  ],
  publisher: string
  publicationYear: number
  subjects: [
    {subject:string}
  ]
  referenceCount: number
  citationCount: number
  // and many more but we are initially interesed in these
  // see exapleResponse for more or response from
  // https://api.datacite.org/dois/10.5281/zenodo.1051064
  // documentation https://support.datacite.org/reference/get_dois-id
}


type DoiData = {
  id: string
  type: string
}

type DoiReplationships = {
  client: {
    data: DoiData
  },
  citations: {
    data: DoiData
  },
  versions: {
    data: DoiData[]
  },
  versionOf: {
    data: DoiData[]
  }
}


type DoisResponse = {
  id: string,
  type: 'dois'
  attributes: DoiAttributes
  relationships: DoiReplationships
}

export type DataciteDoisApiResponse = {
  data: DoisResponse
}

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

export type WorkResponse = typeof exampleWork

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
  'publisher': 'Springer Science and Business Media LLC',
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

const conceptDoiResp = {
  'data': {
    'software': {
      'doi': '10.5281/zenodo.800648',
      'versionCount': 0,
      'versionOfCount': 1,
      'versionOf': {
        'nodes': [
          {
            'doi': '10.5281/zenodo.705645'
          }
        ]
      }
    }
  }
}

export type DataCiteConceptDoiQlResp = typeof conceptDoiResp
