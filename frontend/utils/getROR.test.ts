// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 dv4all
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
  mockFetchJson.mockResolvedValueOnce({items:[{
    id:'test-id',
    name:'Test organisation',
    country:{country_name:'Test country'},
    addresses:[
      {city: 'Test city'}
    ],
    links:[],
    types:['Education']
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
        'website': null,
        'is_tenant': false,
        'country': 'Test country',
        'city': 'Test city',
        'wikipedia_url': null,
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
    `https://api.ror.org/organizations?query=${searchFor}`,
    {'headers': {'Content-Type': 'application/json'}}
  )
})
