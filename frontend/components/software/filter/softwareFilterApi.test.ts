// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce, mockRejectedValueOnce} from '~/utils/jest/mockFetch'
import {searchForKeyword, searchForProgrammingLanguage} from './softwareFilterApi'


beforeEach(() => {
  jest.clearAllMocks()
})

describe('searchForKeyword', () => {
  it('calls fetch with proper params', async () => {
    const searchFor = 'Test search'
    const expectUrl = `/api/v1/rpc/keyword_count_for_software?keyword=ilike.*${encodeURIComponent(searchFor)}*&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc&limit=30`
    const expectPayload = {
      'method': 'GET'
    }

    mockResolvedValueOnce([])

    const resp = await searchForKeyword({searchFor})

    expect(global.fetch).toBeCalledTimes(1)
    expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
  })

  it('returns [] on error/promise.reject', async () => {
    const searchFor = 'Test search'
    const message = 'This is test'
    mockRejectedValueOnce({message})

    const resp = await searchForKeyword({searchFor})

    // fetch called
    expect(global.fetch).toBeCalledTimes(1)
    // returned [] on error
    expect(resp).toEqual([])
    // and called logger to log error
    expect(global.console.error).toBeCalledTimes(1)
    expect(global.console.error).toBeCalledWith(`[ERROR] searchForKeyword: ${message}`)
  })

})

describe('searchForProgrammingLanguage', () => {

  it('calls fetch with proper params', async () => {
    const searchFor = 'Test search'
    const expectUrl = `/api/v1/rpc/prog_lang_cnt_for_software?prog_lang=ilike.*${encodeURIComponent(searchFor)}*&cnt=gt.0&order=cnt.desc.nullslast,prog_lang.asc&limit=30`
    const expectPayload = {
      'method': 'GET'
    }

    mockResolvedValueOnce([])

    const resp = await searchForProgrammingLanguage({searchFor})

    expect(global.fetch).toBeCalledTimes(1)
    expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
  })

  it('returns [] on error/promise.reject', async () => {
    const searchFor = 'Test search'
    const message = 'This is test'

    mockRejectedValueOnce({message})

    const resp = await searchForProgrammingLanguage({searchFor})

    // fetch called
    expect(global.fetch).toBeCalledTimes(1)
    // returned [] on error
    expect(resp).toEqual([])
    // and called logger to log error
    expect(global.console.error).toBeCalledTimes(1)
    expect(global.console.error).toBeCalledWith(`[ERROR] searchForProgrammingLanguage: ${message}`)
  })

})
