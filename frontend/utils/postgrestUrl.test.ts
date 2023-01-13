// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {rowsPerPageOptions} from '~/config/pagination'
import {
  baseQueryString, PostgrestParams,
  projectListUrl, softwareListUrl,
  ssrSoftwareUrl, ssrOrganisationUrl, ssrProjectsUrl
} from './postgrestUrl'

describe('baseQueryString', () => {

  it('provides limit and offset by default', () => {
    const expected = `limit=${rowsPerPageOptions[0]}&offset=0`
    const url = baseQueryString({})
    expect(url).toEqual(expected)
  })

  it('make custom encoded keywords url query string', () => {
    const keywords=['filter-1', 'filter-2']
    const expected = 'keywords=cs.%7B\"filter-1\",\"filter-2\"%7D&limit=12&offset=0'
    const url = baseQueryString({keywords})
    expect(url).toEqual(expected)
  })

  it('make custom encoded domains url query string', () => {
    const domains = ['filter-1', 'filter-2']
    const expected = 'research_domain=cs.%7B\"filter-1\",\"filter-2\"%7D&limit=12&offset=0'
    const url = baseQueryString({domains})
    expect(url).toEqual(expected)
  })

  it('make custom encoded prog_lang url query string', () => {
    const prog_lang = ['filter-1', 'filter-2']
    const expected = 'prog_lang=cs.%7B\"filter-1\",\"filter-2\"%7D&limit=12&offset=0'
    const url = baseQueryString({prog_lang})
    expect(url).toEqual(expected)
  })

  it('makes url query string with order', () => {
    const order = 'pass,any,order,you will'
    const expected = `order=${order}&limit=${rowsPerPageOptions[0]}&offset=0`
    const url = baseQueryString({order})
    expect(url).toEqual(expected)
  })

  it('accepts all params properly', () => {
    const keywords = ['filter-1', 'filter-2']
    const order = 'pass,any,order,you will'
    const limit = 24
    const offset = 101
    const expected = 'keywords=cs.%7B\"filter-1\",\"filter-2\"%7D&order=pass,any,order,you will&limit=24&offset=101'
    const url = baseQueryString({keywords,order,limit,offset})
    expect(url).toEqual(expected)
  })

})

describe('ssrSoftwareUrl', () => {
  it('returns software page url with stringified and encoded keywords query parameters', () => {
    const expectUrl = '/software?page=0&rows=12&keywords=%5B%22filter-1%22%2C%22filter-2%22%5D'
    const url = ssrSoftwareUrl({
      keywords: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns software page url with stringified and encoded prog_lang query parameters', () => {
    const expectUrl = '/software?page=0&rows=12&prog_lang=%5B%22filter-1%22%2C%22filter-2%22%5D'
    const url = ssrSoftwareUrl({
      prog_lang: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns software page url with search param and page 10', () => {
    const expectUrl = '/software?page=10&rows=12&search=test-search-item'
    const url = ssrSoftwareUrl({
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })
})

describe('softwareListUrl', () => {
  it('returns postgrest endpoint url when only baseUrl provided', () => {
    const baseUrl = 'http://test-base-url'
    const expectUrl = `${baseUrl}/rpc/software_search?limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns postgrest endpoint url with search params', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/software_search?limit=12&offset=0&or=(brand_name.ilike.*test-search*,short_statement.ilike.*test-search*,keywords_text.ilike.*test-search*)`
    const url = softwareListUrl({
      baseUrl,
      // if you change search value then change expectedUrl values too
      search: 'test-search'
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns postgrest endpoint url with keywords params', () => {
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

describe('ssrProjectsUrl', () => {
  it('returns projects page url with stringified and encoded keywords query parameters', () => {
    const expectUrl = '/projects?page=0&rows=12&keywords=%5B%22filter-1%22%2C%22filter-2%22%5D'
    const url = ssrProjectsUrl({
      keywords: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns projects page url with stringified and encoded research_domain query parameters', () => {
    const expectUrl = '/projects?page=0&rows=12&domains=%5B%22filter-1%22%2C%22filter-2%22%5D'
    const url = ssrProjectsUrl({
      domains: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns projects page url with search param and page 10', () => {
    const expectUrl = '/projects?page=10&rows=12&search=test-search-item'
    const url = ssrProjectsUrl({
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })
})

describe('projectListUrl', () => {
  it('returns postgrest endpoint url when only baseUrl provided', () => {
    const baseUrl = 'http://test-base-url'
    const expectUrl = `${baseUrl}/rpc/project_search?limit=12&offset=0`
    const url = projectListUrl({
      baseUrl
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns postgrest endpoint url with search params', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/project_search?limit=12&offset=0&or=(title.ilike.*test-search*,subtitle.ilike.*test-search*,keywords_text.ilike.*test-search*,research_domain_text.ilike.*test-search*)`
    const url = projectListUrl({
      baseUrl,
      // if you change search value then change expectedUrl values too
      search: 'test-search'
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns postgrest endpoint url with keywords params', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/project_search?keywords=cs.%7B\"test-filter\"%7D&limit=12&offset=0`
    const url = projectListUrl({
      baseUrl,
      keywords: ['test-filter']
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns postgrest endpoint url with research_domain params', () => {
    const baseUrl = 'http://test-base-url'
    // if you change values then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/project_search?research_domain=cs.%7B\"test-filter\"%7D&limit=12&offset=0`
    const url = projectListUrl({
      baseUrl,
      domains: ['test-filter']
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })
})

describe('ssrOrganisationUrl', () => {
  it('returns organisations page url with stringified and encoded keywords query parameters', () => {
    const expectUrl = '/organisations?page=0&rows=12&keywords=%5B%22filter-1%22%2C%22filter-2%22%5D'
    const url = ssrOrganisationUrl({
      keywords: ['filter-1', 'filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns organisations page url with search param and page 10', () => {
    const expectUrl = '/organisations?page=10&rows=12&search=test-search-item'
    const url = ssrOrganisationUrl({
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })
})
