// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {getRsdPathForOrganisation} from './apiEditOrganisation'

describe('getRsdPathForOrganisation', () => {
  it('returns rsd_path in response message', async () => {
    const mockData = {
      organisation: 'TEST-ORGANISATION-NAME',
      rsd_path: 'test_organisation_path',
      parent_names: 'TEST-PARENT-NAMES'
    }
    // mock response
    mockResolvedValueOnce(mockData)
    // get organisation path to link to in the message
    const slug = await getRsdPathForOrganisation({
      uuid: 'TEST_ORGANISATION_UUID',
      token: 'TEST_TOKEN'
    })

    expect(slug.status).toEqual(200)
    expect(slug.message).toEqual(mockData.rsd_path)
  })

  it('returns custom error message from api', async () => {
    const mockError = {
      status: 400,
      message: 'This is custom error message from api'
    }
    // mock error response
    mockResolvedValueOnce({
      message: mockError.message
    }, {
      status: mockError.status,
      statusText: 'Not OK'
    })
    // get organisation path to link to in the message
    const slug = await getRsdPathForOrganisation({
      uuid: 'TEST_ORGANISATION_UUID',
      token: 'TEST_TOKEN'
    })

    expect(slug.status).toEqual(mockError.status)
    expect(slug.message).toEqual(mockError.message)
  })
})

