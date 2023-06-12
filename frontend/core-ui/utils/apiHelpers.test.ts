// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {extractParam} from './apiHelpers'

const req = {
  query: {
    testParam: 'test-value',
    test: ['item 1', 'item 2']
  }
}

it('extract param from request', () => {

  const p = extractParam(req as any, 'testParam')

  expect(p).toEqual('test-value')
})

it('returns empty string when param not in request', () => {

  const p = extractParam(req as any, 'nonExisting')

  expect(p).toEqual('')
})

it('returns object as string', () => {

  const p = extractParam(req as any, 'test')

  expect(p).toEqual('item 1,item 2')
})
