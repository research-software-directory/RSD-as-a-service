// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {
  searchForResearchDomain,
  getResearchDomainInfo,
  searchForKeyword
} from './projectFilterApi'


beforeEach(()=> {
  jest.clearAllMocks()
})

it('searchForResearchDomain calls api', async () => {
  const searchFor = 'Test serch for'
  const expectUrl = `/api/v1/rpc/research_domain_count_for_projects?or=(key.ilike.*${searchFor}*,name.ilike.*${searchFor}*)&cnt=gt.0&order=cnt.desc.nullslast,name.asc&limit=30`

  const expectPayload = {
    'method': 'GET'
  }

  // resolve with no options
  mockResolvedValueOnce([])

  const resp = await searchForResearchDomain({
    searchFor
  })

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl,expectPayload)
})


it('getResearchDomainInfo calls api', async () => {
  const searchKeys = ['Test serch for']
  const expectUrl = `/api/v1/rpc/research_domain_count_for_projects?key=in.("${searchKeys.join('","')}")`

  const expectPayload = {
    'method': 'GET'
  }

  // resolve with no options
  mockResolvedValueOnce([])

  const resp = await getResearchDomainInfo(searchKeys)

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
})


it('searchForKeyword calls api', async () => {
  const searchFor = 'Test serch for'
  const expectUrl = `/api/v1/rpc/keyword_count_for_projects?keyword=ilike.*${searchFor}*&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc&limit=30`

  const expectPayload = {
    'method': 'GET'
  }

  // resolve with no options
  mockResolvedValueOnce([])

  const resp = await searchForKeyword({
    searchFor
  })

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
})
