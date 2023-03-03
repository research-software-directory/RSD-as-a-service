// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {addMarkdownPage, deleteMarkdownPage, saveMarkdownPage, updatePagePositions} from './saveMarkdownPage'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

const mockParams = {
  page: {
    id: null,
    slug: 'test-slug',
    title: 'Test title 1',
    description: null,
    is_published: false,
    position: 1
  } as any,
  token: 'TEST-TOKEN'
}


beforeEach(() => {
  jest.clearAllMocks()
})

it('addMarkdownPage', async() => {
  const expectUrl = '/api/v1/meta_pages'
  const expectBody = {
    'body': '{"id":null,"slug":"test-slug","title":"Test title 1","description":null,"is_published":false,"position":1}',
    'headers': {
      'Authorization': `Bearer ${mockParams.token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    'method': 'POST'
  }

  mockResolvedValueOnce([{
    ...mockParams.page,
    id: 'test-id-1'
  }], {
    status:201
  })

  const resp = await addMarkdownPage(mockParams as any)
  // validate api params
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectBody)
  // validate return
  expect(resp).toEqual({
    'message': {
      'description': null,
      'id': 'test-id-1',
      'is_published': false,
      'position': 1,
      'slug': 'test-slug',
      'title': 'Test title 1',
    },
   'status': 200,
  })
})

it('saveMarkdownPage', async () => {
  mockParams.page.id = 'test-page-id'

  const expectUrl = `/api/v1/meta_pages?id=eq.${mockParams.page.id}`
  const expectBody = {
    'body': '{"id":"test-page-id","slug":"test-slug","title":"Test title 1","description":null,"is_published":false,"position":1}',
    'headers': {
      'Authorization': `Bearer ${mockParams.token}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    'method': 'PATCH'
  }

  mockResolvedValueOnce([{
    ...mockParams.page,
    id: 'test-id-1'
  }], {
    status: 200
  })

  const resp = await saveMarkdownPage(mockParams as any)
  // validate api params
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectBody)
})

it('updatePagePositions/patchMarkdownData', async() => {
  const params = {
    positions: [
      {id: 'test-id-1', slug: 'test-slug-1', position: 1},
      {id: 'test-id-2', slug: 'test-slug-2', position: 2},
      {id: 'test-id-3', slug: 'test-slug-3', position: 3},
    ],
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce('OK')
  mockResolvedValueOnce('OK')
  mockResolvedValueOnce('OK')

  // update position of 3 items
  const resp = await updatePagePositions(params)
  // validate fetch called 3 times
  expect(global.fetch).toBeCalledTimes(3)
  // OK received
  expect(resp).toEqual({
    'message': 'OK',
    'status': 200,
  })
})

it('deleteMarkdownPage', async() => {
  const params = {
    slug: 'test-slug-1',
    token: 'TEST-TOKEN'
  }

  const expectedUrl = `/api/v1/meta_pages?slug=eq.${params.slug}`
  const expectBody = {
    'headers': {
      'Authorization': `Bearer ${params.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'DELETE'
  }

  mockResolvedValueOnce('OK')

  const resp = await deleteMarkdownPage(params)

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectedUrl, expectBody)

  expect(resp).toEqual({
    message: params.slug,
    status: 200
  })
})
