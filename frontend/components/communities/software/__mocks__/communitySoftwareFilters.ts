// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const defaultFilters={
  keywordsList: [
    {
      'keyword': 'Big data',
      'keyword_cnt': 4
    },
    {
      'keyword': 'GPU',
      'keyword_cnt': 2
    },
    {
      'keyword': 'High performance computing',
      'keyword_cnt': 3
    },
    {
      'keyword': 'Image processing',
      'keyword_cnt': 2
    },
    {
      'keyword': 'Inter-operability & linked data',
      'keyword_cnt': 1
    },
    {
      'keyword': 'Machine learning',
      'keyword_cnt': 2
    },
    {
      'keyword': 'Multi-scale & multi model simulations',
      'keyword_cnt': 1
    },
    {
      'keyword': 'Text analysis & natural language processing',
      'keyword_cnt': 1
    },
    {
      'keyword': 'Workflow technologies',
      'keyword_cnt': 2
    }
  ],
  languagesList: [
    {prog_language: 'lang1', prog_language_cnt: 5},
    {prog_language: 'lang2', prog_language_cnt: 3}
  ],
  licensesList: [
    {
      'license': 'Apache-2.0',
      'license_cnt': 3
    },
    {
      'license': 'CC-BY-4.0',
      'license_cnt': 2
    },
    {
      'license': 'CC-BY-NC-ND-3.0',
      'license_cnt': 1
    },
    {
      'license': 'GPL-2.0-or-later',
      'license_cnt': 2
    },
    {
      'license': 'LGPL-2.0-or-later',
      'license_cnt': 3
    },
    {
      'license': 'MIT',
      'license_cnt': 4
    }
  ],
  categoryList: [
    {
      'category': 'L-1-2, C-0db0f',
      'category_cnt': 8
    },
    {
      'category': 'L-2-3, C-0db0f, P-1a6ec',
      'category_cnt': 7
    },
    {
      'category': 'L-1-1, C-0db0f',
      'category_cnt': 6
    },
    {
      'category': 'L-2-4, C-0db0f, P-1a6ec',
      'category_cnt': 5
    },
    {
      'category': 'L-3-1, C-0db0f, P-5a61c',
      'category_cnt': 5
    },
    {
      'category': 'L-2-1, C-0db0f, P-ee701',
      'category_cnt': 4
    },
    {
      'category': 'L-2-1, C-0db0f, P-1a6ec',
      'category_cnt': 3
    },
    {
      'category': 'L-2-2, C-0db0f, P-ee701',
      'category_cnt': 3
    },
    {
      'category': 'L-2-3, C-0db0f, P-ee701',
      'category_cnt': 3
    },
    {
      'category': 'L-3-1, C-0db0f, P-a05bf',
      'category_cnt': 3
    },
    {
      'category': 'L-2-2, C-0db0f, P-1a6ec',
      'category_cnt': 2
    },
    {
      'category': 'L-3-1, C-0db0f, P-7c891',
      'category_cnt': 2
    },
    {
      'category': 'L-3-1, C-0db0f, P-dc442',
      'category_cnt': 2
    },
    {
      'category': 'L-3-2, C-0db0f, P-93ffa',
      'category_cnt': 2
    },
    {
      'category': 'L-3-2, C-0db0f, P-a05bf',
      'category_cnt': 2
    },
    {
      'category': 'L-3-3, C-0db0f, P-6449a',
      'category_cnt': 2
    },
    {
      'category': 'L-3-1, C-0db0f, P-3e18f',
      'category_cnt': 1
    },
    {
      'category': 'L-3-1, C-0db0f, P-6449a',
      'category_cnt': 1
    },
    {
      'category': 'L-3-1, C-0db0f, P-93ffa',
      'category_cnt': 1
    },
    {
      'category': 'L-3-2, C-0db0f, P-6449a',
      'category_cnt': 1
    }
  ],
  categoryEntry: [
    [
      {
        'id': 'ee701c07-a5ba-4ff5-b623-db60bb8afa66',
        'parent': null,
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-1-1, C-0db0f',
        'name': 'Level 1, item 1, community-0db0f',
        'properties': {
          'count': 6
        },
        'provenance_iri': null
      },
      {
        'id': '1a6ecbbf-53cd-4c43-829e-cd931eab5e0c',
        'parent': null,
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-1-2, C-0db0f',
        'name': 'Level 1, item 2, community-0db0f',
        'properties': {
          'count': 8
        },
        'provenance_iri': null
      },
      {
        'id': 'dc442973-59ed-4687-b24a-b5a37acf4349',
        'parent': 'ee701c07-a5ba-4ff5-b623-db60bb8afa66',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-3, C-0db0f, P-ee701',
        'name': 'Level 2, item 3, community-0db0f, parent-ee701',
        'properties': {
          'count': 3
        },
        'provenance_iri': null
      },
      {
        'id': '93ffa24f-51b7-48d4-97bd-4249acc85ec6',
        'parent': 'ee701c07-a5ba-4ff5-b623-db60bb8afa66',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-2, C-0db0f, P-ee701',
        'name': 'Level 2, item 2, community-0db0f, parent-ee701',
        'properties': {
          'count': 3
        },
        'provenance_iri': null
      },
      {
        'id': '6449af3c-de41-444f-8787-2ac276d0ae69',
        'parent': 'ee701c07-a5ba-4ff5-b623-db60bb8afa66',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-1, C-0db0f, P-ee701',
        'name': 'Level 2, item 1, community-0db0f, parent-ee701',
        'properties': {
          'count': 4
        },
        'provenance_iri': null
      },
      {
        'id': 'a05bff33-1794-48e1-8933-04ce781692bf',
        'parent': '1a6ecbbf-53cd-4c43-829e-cd931eab5e0c',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-4, C-0db0f, P-1a6ec',
        'name': 'Level 2, item 4, community-0db0f, parent-1a6ec',
        'properties': {
          'count': 5
        },
        'provenance_iri': null
      },
      {
        'id': '3e18f652-d141-4d5a-aaaa-5b934269c194',
        'parent': '1a6ecbbf-53cd-4c43-829e-cd931eab5e0c',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-2, C-0db0f, P-1a6ec',
        'name': 'Level 2, item 2, community-0db0f, parent-1a6ec',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      },
      {
        'id': '5a61cec7-9f65-4ef4-ab7f-641c24ef5fba',
        'parent': '1a6ecbbf-53cd-4c43-829e-cd931eab5e0c',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-3, C-0db0f, P-1a6ec',
        'name': 'Level 2, item 3, community-0db0f, parent-1a6ec',
        'properties': {
          'count': 7
        },
        'provenance_iri': null
      },
      {
        'id': '7c89170d-d2e9-42d9-b5a5-bce97d24a170',
        'parent': '1a6ecbbf-53cd-4c43-829e-cd931eab5e0c',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-2-1, C-0db0f, P-1a6ec',
        'name': 'Level 2, item 1, community-0db0f, parent-1a6ec',
        'properties': {
          'count': 3
        },
        'provenance_iri': null
      },
      {
        'id': '49f78845-0bbd-442d-a83a-e178e9ece352',
        'parent': 'dc442973-59ed-4687-b24a-b5a37acf4349',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-dc442',
        'name': 'Level 3, item 1, community-0db0f, parent-dc442',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      },
      {
        'id': 'a5c741b2-621e-4175-a7d3-04bdb94f29de',
        'parent': 'dc442973-59ed-4687-b24a-b5a37acf4349',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-2, C-0db0f, P-dc442',
        'name': 'Level 3, item 2, community-0db0f, parent-dc442',
        'properties': {},
        'provenance_iri': null
      },
      {
        'id': '23ece68a-71ae-4b34-86a9-1f0bae42a9b8',
        'parent': '93ffa24f-51b7-48d4-97bd-4249acc85ec6',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-93ffa',
        'name': 'Level 3, item 1, community-0db0f, parent-93ffa',
        'properties': {
          'count': 1
        },
        'provenance_iri': null
      },
      {
        'id': '546a715e-0eaa-474f-968f-ddc9c3fe238b',
        'parent': '93ffa24f-51b7-48d4-97bd-4249acc85ec6',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-2, C-0db0f, P-93ffa',
        'name': 'Level 3, item 2, community-0db0f, parent-93ffa',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      },
      {
        'id': '27d1ab72-2acc-4607-af4b-d3ff73170ae2',
        'parent': '6449af3c-de41-444f-8787-2ac276d0ae69',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-3, C-0db0f, P-6449a',
        'name': 'Level 3, item 3, community-0db0f, parent-6449a',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      },
      {
        'id': 'f0369ded-b19d-448b-affb-ff60ba272dab',
        'parent': '6449af3c-de41-444f-8787-2ac276d0ae69',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-2, C-0db0f, P-6449a',
        'name': 'Level 3, item 2, community-0db0f, parent-6449a',
        'properties': {
          'count': 1
        },
        'provenance_iri': null
      },
      {
        'id': '0a984a5c-fc04-42cf-a8df-80dfa36299ba',
        'parent': '6449af3c-de41-444f-8787-2ac276d0ae69',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-6449a',
        'name': 'Level 3, item 1, community-0db0f, parent-6449a',
        'properties': {
          'count': 1
        },
        'provenance_iri': null
      },
      {
        'id': 'f27e719f-cce7-4a65-bab0-66cbbc7f24a2',
        'parent': 'a05bff33-1794-48e1-8933-04ce781692bf',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-2, C-0db0f, P-a05bf',
        'name': 'Level 3, item 2, community-0db0f, parent-a05bf',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      },
      {
        'id': 'c4b0d055-410b-4e70-8d05-c4614b90b1a0',
        'parent': 'a05bff33-1794-48e1-8933-04ce781692bf',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-a05bf',
        'name': 'Level 3, item 1, community-0db0f, parent-a05bf',
        'properties': {
          'count': 3
        },
        'provenance_iri': null
      },
      {
        'id': '88a6dedb-fb32-4c5a-a485-6fc645661c3d',
        'parent': 'a05bff33-1794-48e1-8933-04ce781692bf',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-3, C-0db0f, P-a05bf',
        'name': 'Level 3, item 3, community-0db0f, parent-a05bf',
        'properties': {},
        'provenance_iri': null
      },
      {
        'id': 'd87e6590-cd2f-4435-bebd-a4a9fc75d563',
        'parent': '3e18f652-d141-4d5a-aaaa-5b934269c194',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-3e18f',
        'name': 'Level 3, item 1, community-0db0f, parent-3e18f',
        'properties': {
          'count': 1
        },
        'provenance_iri': null
      },
      {
        'id': '8faf22eb-9565-4621-b432-1a20d2facd68',
        'parent': '5a61cec7-9f65-4ef4-ab7f-641c24ef5fba',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-5a61c',
        'name': 'Level 3, item 1, community-0db0f, parent-5a61c',
        'properties': {
          'count': 5
        },
        'provenance_iri': null
      },
      {
        'id': 'c376d436-69e2-4433-b413-5a22b56926a7',
        'parent': '7c89170d-d2e9-42d9-b5a5-bce97d24a170',
        'community': '0db0f49f-c967-4683-b7e1-1f8a045205c5',
        'organisation': null,
        'allow_software': true,
        'allow_projects': false,
        'short_name': 'L-3-1, C-0db0f, P-7c891',
        'name': 'Level 3, item 1, community-0db0f, parent-7c891',
        'properties': {
          'count': 2
        },
        'provenance_iri': null
      }
    ]
  ]
}
