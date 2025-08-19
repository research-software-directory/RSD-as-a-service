// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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
  const expectUrl = '/api/v1/meta_page'
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
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl, expectBody)
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

  const expectUrl = `/api/v1/meta_page?id=eq.${mockParams.page.id}`
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

  await saveMarkdownPage(mockParams as any)
  // validate api params
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl, expectBody)
})

it('updatePagePositions/patchMarkdownData', async() => {
  const params = {
    items: [
      {id: 'test-id-1', title:'test title 1',slug: 'test-slug-1', position: 1},
      {id: 'test-id-2', title: 'test title 2',slug: 'test-slug-2', position: 2},
      {id: 'test-id-3', title: 'test title 3', slug: 'test-slug-3', position: 3},
    ],
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce('OK')
  mockResolvedValueOnce('OK')
  mockResolvedValueOnce('OK')

  // update position of 3 items
  const resp = await updatePagePositions(params)
  // validate fetch called 3 times
  expect(global.fetch).toHaveBeenCalledTimes(3)
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

  const expectedUrl = `/api/v1/meta_page?slug=eq.${params.slug}`
  const expectBody = {
    'headers': {
      'Authorization': `Bearer ${params.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'DELETE'
  }

  mockResolvedValueOnce('OK')

  const resp = await deleteMarkdownPage(params)

  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectBody)

  expect(resp).toEqual({
    message: params.slug,
    status: 200
  })
})
