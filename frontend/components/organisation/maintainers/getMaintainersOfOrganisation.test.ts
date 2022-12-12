// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getMaintainersOfOrganisation} from './getMaintainersOfOrganisation'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

const mockResponse = [{
  maintainer: 'test-maintainer-id',
  name: ['Organisation name'],
  email: ['test@email.com'],
  affiliation: ['Test affiliation'],
  is_primary: false
}]

const mockProps = {
  organisation: 'Organisation name',
  token: 'TEST-TOKEN',
  frontend: true
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('calls api with proper params', async() => {
  const expectedUrl = `/api/v1/rpc/maintainers_of_organisation?organisation_id=${mockProps.organisation}`
  const expectedHeaders = {
    'headers': {
      'Authorization': `Bearer ${mockProps.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }
  mockResolvedValueOnce(mockResponse, {
    status: 200,
    statusText: 'OK'
  })

  const resp = await getMaintainersOfOrganisation(mockProps)

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectedUrl, expectedHeaders)
})

it('returns [] on error', async() => {

  mockResolvedValueOnce(mockResponse, {
    status: 400,
    statusText: 'Bad request'
  })

  const resp = await getMaintainersOfOrganisation(mockProps)
  expect(resp).toEqual([])
})
