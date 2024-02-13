// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {
  findPublicationByTitle,
  addNewOutputToProject,
  addToOutputForProject,
  removeOutputForProject
} from './outputForProjectApi'

import outputForProject from './__mocks__/outputForProject.json'


beforeEach(() => {
  jest.clearAllMocks()
})

it('findPublicationByTitle', async () => {
  const props = {
    project: 'test-project',
    searchFor: 'search term',
    token: 'TEST-TOKEN'
  }

  const expectedUrl = `/api/fe/mention/output?id=${props.project}&search=${encodeURIComponent(props.searchFor)}`
  const expectBody = {
    'headers': {
      'Authorization': `Bearer ${props.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }

  // resolve empty array
  mockResolvedValueOnce(outputForProject)
  // make call
  const resp = await findPublicationByTitle(props)

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectedUrl, expectBody)
  expect(resp).toEqual(outputForProject)
})

it('addNewOutputToProject', async () => {
  const props = {
    item: outputForProject[0] as any,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }
  // resolve
  mockResolvedValueOnce([outputForProject[0]])

  const resp = await addNewOutputToProject(props)

  expect(resp).toEqual({
    status: 200,
    message: outputForProject[0]
  })
})

it('addToImpactForProject', async () => {
  const props = {
    mention: outputForProject[0].id,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce([])

  const resp = await addToOutputForProject(props)

  expect(resp).toEqual({
    message: props.mention,
    'status': 200,
  })
})

it('removeOutputForProject', async () => {
  const props = {
    mention: outputForProject[0].id,
    project: 'test-project-id',
    token: 'TEST-TOKEN'
  }

  mockResolvedValueOnce([])

  const resp = await removeOutputForProject(props)
  expect(resp).toEqual({
    status: 200,
    message: props.mention
  })
})


