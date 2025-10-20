// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {
  findPublicationByTitle,
  addNewImpactToProject,
  addToImpactForProject,
  removeImpactForProject
} from './impactForProjectApi'

import impactForProject from './__mocks__/impactForProject.json'

// MOCK
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetMentionByDoiFromRsd = jest.fn((props) => Promise.resolve([] as any))
jest.mock('~/components/mention/apiEditMentions', () => ({
  ...jest.requireActual('~/components/mention/apiEditMentions'),
  getMentionByDoiFromRsd: jest.fn(props => mockGetMentionByDoiFromRsd(props))
}))


beforeEach(() => {
  jest.clearAllMocks()
})

it('findPublicationByTitle', async () => {
  const props = {
    id: 'test-project',
    searchFor: 'search term',
    token: 'TEST-TOKEN'
  }

  const expectedUrl = `/api/fe/mention/find_by_title?id=${props.id}&search=${encodeURIComponent(props.searchFor)}&relation_type=impact`
  const expectBody = {
    'headers': {
      'Authorization': `Bearer ${props.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }

  // resolve empty array
  mockResolvedValueOnce(impactForProject)
  // make call
  const resp = await findPublicationByTitle(props)

  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl,expectBody)
  expect(resp).toEqual(impactForProject)
})

it('addNewImpactToProject', async() => {
  const props = {
    item: impactForProject[0] as any,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }
  // resolve
  mockResolvedValueOnce([impactForProject[0]])

  const resp = await addNewImpactToProject(props)

  expect(resp).toEqual({
    status: 200,
    message: impactForProject[0]
  })
})

it('addToImpactForProject', async() => {
  const props = {
    mention: impactForProject[0].id,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce([])

  const resp = await addToImpactForProject(props)

  expect(resp).toEqual({
    message: props.mention,
    'status': 200,
  })
})

it('removeImpactForProject', async() => {
  const props = {
    mention: impactForProject[0].id,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce([])

  const resp = await removeImpactForProject(props)
  expect(resp).toEqual({
    status: 200,
    message: props.mention
  })
})
