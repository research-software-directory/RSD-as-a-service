// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {PostgrestParams, softwareListUrl, softwareUrl} from './postgrestUrl'

describe('softwareListUrl', () => {
  it('returns softwareListUrl when only baseUrl provided', () => {
    const baseUrl='http://test-base-url'
    const expectUrl = `${baseUrl}/rpc/software_search?&limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with search', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/software_search?&or=(brand_name.ilike.*test-search*, short_statement.ilike.*test-search*)&limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl,
      // if you change search value then change expectedUrl values too
      search:'test-search'
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with keywords', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/software_search?keywords=cs.%7B\"test-filter\"%7D&limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl,
      keywords: ['test-filter']
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })
})


describe('softwareUrl', () => {
  it('returns softwareUrl with stringified and encoded keywords filter', () => {
    const expectUrl = '/software?&keywords=%5B%22filter-1%22%2C%22filter-2%22%5D&page=0&rows=12'
    const url = softwareUrl({
      keywords: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with search param and page 10', () => {
    const expectUrl = '/software?search=test-search-item&page=10&rows=12'
    const url = softwareUrl({
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })

})
