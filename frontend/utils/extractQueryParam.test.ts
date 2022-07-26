// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'node:querystring'
import {extractQueryParam} from './extractQueryParam'


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
