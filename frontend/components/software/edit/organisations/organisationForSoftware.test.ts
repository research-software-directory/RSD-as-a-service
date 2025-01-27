// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {
  createOrganisationAndAddToSoftware,
  addOrganisationToSoftware,
  patchOrganisationPositions,
  deleteOrganisationFromSoftware
} from './organisationForSoftware'
import organisationOfSoftware from './__mocks__/organisationsOfSoftware.json'


beforeEach(() => {
  jest.clearAllMocks()
})

it('createOrganisationAndAddToSoftware', async () => {
  const mockProps = {
    item: organisationOfSoftware[0],
    token: 'TEST-TOKEN',
    software: 'test-software'
  }
  const mockId = 'mocked-organisation-id'
  // resolve createOrganisation api call
  mockResolvedValueOnce({
    message: 'new-organisation-id'
  },{
    status: 201,
    headers: {
      get: () => `a.${mockId}`
    }
  })
  // resolve addOrganisationToSoftware
  mockResolvedValueOnce({
    message: 'approved'
  })

  const resp = await createOrganisationAndAddToSoftware(mockProps as any)

  expect(resp.status).toEqual(200)
  expect(resp.message).toEqual({
    ...organisationOfSoftware[0],
    id: mockId
  })
})

it('addOrganisationToSoftware', async() => {
  const mockProps = {
    software: 'test-software',
    organisation: 'test-organisation',
    position: 1,
    token: 'TEST-TOKEN'
  }

  // resolve addOrganisationToSoftware
  mockResolvedValueOnce({
    message: 'approved'
  })

  const resp = await addOrganisationToSoftware(mockProps as any)

  expect(resp.status).toEqual(200)
  expect(resp.message).toEqual('approved')
})

it('patchOrganisationPositions', async () => {
  const mockProps = {
    software: 'test-software',
    organisations: organisationOfSoftware,
    token: 'TEST-TOKEN'
  }

  // resolve addOrganisationToSoftware
  organisationOfSoftware.forEach(() => {
    // resolve OK for all items to patch
    mockResolvedValueOnce('OK')
  })

  const resp = await patchOrganisationPositions(mockProps as any)

  // validate all OK
  expect(resp.status).toEqual(200)
  //  validate fetch called for each organisation item
  expect(global.fetch).toHaveBeenCalledTimes(organisationOfSoftware.length)
})

it('deleteOrganisationFromSoftware', async () => {
  const mockProps = {
    software: 'test-software',
    organisation: 'test-organisation',
    token: 'TEST-TOKEN'
  }

  // resolve addOrganisationToSoftware
  mockResolvedValueOnce('OK')

  const resp = await deleteOrganisationFromSoftware(mockProps as any)

  expect(resp.status).toEqual(200)
  expect(resp.message).toEqual('OK')
})
