// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'node:querystring'
import {
  decodeQueryParam, ssrSoftwareParams,
  ssrProjectsParams, ssrBasicParams
} from './extractQueryParam'


it('extracts rows param from url query', () => {
  const query: ParsedUrlQuery = {
    rows: '12'
  }
  const rows = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  expect(rows).toEqual(12)
})

it('extracts page param from url query', () => {
  const query: ParsedUrlQuery = {
    page: '1'
  }
  const page = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 0,
    castToType: 'number'
  })
  expect(page).toEqual(1)
})


it('extracts search param from url query', () => {
  const expected = 'test search'
  const query: ParsedUrlQuery = {
    search: expected
  }
  const search = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null,
    castToType: 'string'
  })
  expect(search).toEqual(expected)
})

it('extracts keywords as array from url query', () => {
  const expected = ['test keyword 1', 'test, keyword & special chars']
  const encoded = JSON.stringify(expected)
  const query: ParsedUrlQuery = {
    keywords: encoded
  }
  const keywords = decodeQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  expect(keywords).toEqual(expected)
})

it('returns defaultValue when param not in url query', () => {
  const query: ParsedUrlQuery = {}
  const rows = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  expect(rows).toEqual(12)
})

it('extracts ssrSoftwareParams from url query', () => {
  const query: ParsedUrlQuery = {
    'search': 'test search',
    'keywords': '["BAM","FAIR Sofware"]',
    'prog_lang': '["Python","C++"]',
    'licenses': '["MIT","GPL-2.0-or-later"]',
    'categories': '["Category 1","Category 2"]',
    'rsd_host': 'null',
    'order': 'test-order',
    'page': '0',
    'rows': '12'
  }
  const expected = {
    search: 'test search',
    keywords: ['BAM', 'FAIR Sofware'],
    prog_lang: ['Python', 'C++'],
    licenses: ['MIT', 'GPL-2.0-or-later'],
    categories: ['Category 1','Category 2'],
    // null value is string for localhost
    rsd_host: 'null',
    order: 'test-order',
    page: 0,
    rows: 12
  }
  const params = ssrSoftwareParams(query)

  expect(params).toEqual(expected)
})

it('extracts ssrProjectsParams from url query', () => {
  const query: ParsedUrlQuery = {
    'search': 'testing search',
    'keywords': '["Big data","GPU"]',
    'domains': '["SH6","LS"]',
    'organisations': '["Organisation 1","Organisation 2"]',
    'categories': '["cat 1","cat 2"]',
    'project_status': 'finished',
    'order': 'impact_cnt',
    'page': '1',
    'rows': '24'
  }
  const expected = {
    search: 'testing search',
    keywords: ['Big data', 'GPU'],
    domains: ['SH6', 'LS'],
    organisations: ['Organisation 1', 'Organisation 2'],
    categories: ['cat 1','cat 2'],
    project_status: 'finished',
    order: 'impact_cnt',
    page: 1,
    rows: 24
  }
  const params = ssrProjectsParams(query)

  expect(params).toEqual(expected)
})

it('extracts ssrBasicParams from url query', () => {
  const query: ParsedUrlQuery = {
    'search': 'another search',
    'page': '3',
    'rows': '48',
    'order': 'test-order'
  }
  const expected = {
    search: 'another search',
    page: 3,
    rows: 48,
    order: 'test-order'
  }
  const params = ssrBasicParams(query)

  expect(params).toEqual(expected)
})
