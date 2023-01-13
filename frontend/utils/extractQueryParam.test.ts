// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'node:querystring'
import {
  extractQueryParam, ssrSoftwareParams,
  ssrProjectsParams, ssrOrganisationParams
} from './extractQueryParam'


it('extracts rows param from url query', () => {
  const query: ParsedUrlQuery = {
    rows: '12'
  }
  const rows = extractQueryParam({
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
  const page = extractQueryParam({
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
  const search = extractQueryParam({
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
  const keywords = extractQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  expect(keywords).toEqual(expected)
})

it('returns defaultValue when param not in url query', () => {
  const query: ParsedUrlQuery = {}
  const rows = extractQueryParam({
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
    'page': '0',
    'rows': '12'
  }
  const expected = {
    search: 'test search',
    keywords: ['BAM', 'FAIR Sofware'],
    prog_lang: ['Python','C++'],
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
    'page': '1',
    'rows': '24'
  }
  const expected = {
    search: 'testing search',
    keywords: ['Big data', 'GPU'],
    domains: ['SH6', 'LS'],
    page: 1,
    rows: 24
  }
  const params = ssrProjectsParams(query)

  expect(params).toEqual(expected)
})

it('extracts ssrOrganisationParams from url query', () => {
  const query: ParsedUrlQuery = {
    'search': 'another search',
    'page': '3',
    'rows': '48'
  }
  const expected = {
    search: 'another search',
    page: 3,
    rows: 48
  }
  const params = ssrOrganisationParams(query)

  expect(params).toEqual(expected)
})
