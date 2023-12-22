// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {
  findPublicationByTitle,
  addNewMentionToSoftware,
  addToMentionForSoftware,
  removeMentionForSoftware
} from './mentionForSoftwareApi'
import mentionForSoftware from './__mocks__/mentionForSoftware.json'

beforeEach(() => {
  jest.clearAllMocks()
})

it('findPublicationByTitle', async () => {
  const props = {
    software: 'test-software-id',
    searchFor: 'Test search',
    token: 'TEST-TOKEN'
  }

  const expectedUrl = `/api/fe/mention/software?id=${props.software}&search=${encodeURIComponent(props.searchFor)}`
  const expectBody = {
    'headers': {
      'Authorization': `Bearer ${props.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }

  mockResolvedValueOnce([])

  const resp = await findPublicationByTitle(props)

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectedUrl, expectBody)

})

it('addNewMentionToSoftware', async () => {
  const props = {
    software: 'test-software-id',
    item: mentionForSoftware[0] as any,
    token: 'TEST-TOKEN'
  }

  // resolve
  mockResolvedValueOnce([mentionForSoftware[0]])

  const resp = await addNewMentionToSoftware(props)

  expect(resp).toEqual({
    status: 200,
    message: mentionForSoftware[0]
  })
})

it('addToMentionForSoftware', async () => {
  const props = {
    software: 'test-software-id',
    mention: mentionForSoftware[0] as any,
    token: 'TEST-TOKEN'
  }

  // resolve
  mockResolvedValueOnce([])

  const resp = await addToMentionForSoftware(props)

  expect(resp).toEqual({
    status: 200,
    message: props.mention
  })
})

it('removeMentionForSoftware', async () => {
  const props = {
    software: 'test-software-id',
    mention: mentionForSoftware[0] as any,
    token: 'TEST-TOKEN'
  }

  // resolve
  mockResolvedValueOnce([])

  const resp = await removeMentionForSoftware(props)

  expect(resp).toEqual({
    status: 200,
    message: props.mention
  })
})

