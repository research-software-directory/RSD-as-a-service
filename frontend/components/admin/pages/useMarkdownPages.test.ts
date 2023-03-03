// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ssrMarkdownPage, getPageLinks} from './useMarkdownPages'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

beforeEach(() => {
  jest.clearAllMocks()
})

it('ssrMarkdownPage/getMarkdownPage', async() => {
  // without slug
  const resp1 = await ssrMarkdownPage()
  // it returns notFound - 404
  expect(resp1).toEqual({
    notFound:true
  })

  // mock response
  const mockValues = {
    title: 'Test title',
    description: 'This is test description'
  }
  mockResolvedValueOnce(mockValues)

  const resp2 = await ssrMarkdownPage('test-slug')
  expect(resp2).toEqual({
    'props': {
      'title': mockValues.title,
      'markdown': mockValues.description,
    }
  })
})

it('getPageLinks', async() => {
  const mockLinks = [
    {id: '1', position: 1, title: 'Test title 1', slug: 'test-slug-1', is_published: true},
    {id: '2', position: 2, title: 'Test title 2', slug: 'test-slug-2', is_published: false},
    {id: '3', position: 3, title: 'Test title 3', slug: 'test-slug-3', is_published: true},
  ]
  mockResolvedValueOnce(mockLinks)

  const resp = await getPageLinks({
    is_published: true,
    token: 'TEST-TOKEN'
  })

  expect(resp).toEqual(mockLinks)
})
