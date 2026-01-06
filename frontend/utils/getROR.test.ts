// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {findInROR} from './getROR'

// mock fetch
const mockFetchJson = jest.fn((props) => Promise.resolve(props))
const mockFetch = jest.fn((props) => {
  return Promise.resolve({
    status: 200,
    ok: true,
    json: ()=>mockFetchJson(props)
  })
})
global.fetch = mockFetch as any

beforeEach(() => {
  jest.clearAllMocks()
})

it('findInROR calls fetch with search param and json header', async () => {
  const searchFor = 'ABCD'
  // mock ROR response
  mockFetchJson.mockResolvedValueOnce({items: [{
    id: 'test-id',
    names: [{value: 'Test organisation', types: ['ror_display']}],
    locations: [{geonames_details: {country_name:'Test country', name: 'Test city'}}],
    links: [
      {
        'type': 'website',
        'value': 'https://www.test-organisation.com/'
      },
      {
        'type': 'wikipedia',
        'value': 'https://en.wikipedia.org/wiki/test-organisation'
      }
    ],
    types: ['Education']
  }]})

  const resp = await findInROR({searchFor})

  // validate response of 1 organisation
  expect(resp).toEqual([
    {
      'data': {
        'id': null,
        'parent': null,
        'primary_maintainer': null,
        'slug': 'test-organisation',
        'name': 'Test organisation',
        'short_description': null,
        'description': null,
        'ror_id': 'test-id',
        'website': 'https://www.test-organisation.com/',
        'is_tenant': false,
        'country': 'Test country',
        'city': 'Test city',
        'wikipedia_url': 'https://en.wikipedia.org/wiki/test-organisation',
        'ror_types': ['Education'],
        'logo_id': null,
        'source': 'ROR',
      },
      'key': 'test-id',
      'label': 'Test organisation',
    },
  ])

  expect(mockFetch).toHaveBeenCalledTimes(1)
  expect(mockFetch).toHaveBeenCalledWith(
    `https://api.ror.org/v2/organizations?query=${searchFor}`,
    {'headers': {'Content-Type': 'application/json'}}
  )
})
