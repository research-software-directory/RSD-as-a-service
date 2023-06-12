// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import useSoftwareToEdit from './useSoftwareToEdit'
import useSoftwareToEditData from './__mocks__/useSoftwareToEditData.json'

// MOCS
// Mock getSoftwareToEdit
const mockGetSoftwareToEdit = jest.fn(props => Promise.resolve([]as any))
jest.mock('~/utils/editSoftware', () => ({
  getSoftwareToEdit: jest.fn(props=>mockGetSoftwareToEdit(props))
}))

// MOCK getKeywordsForSoftware, getLicenseForSoftware
const mockGetKeywordsForSoftware = jest.fn(props => Promise.resolve([] as any))
const mockGetLicenseForSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getSoftware', () => ({
  getKeywordsForSoftware: jest.fn(props => mockGetKeywordsForSoftware(props)),
  getLicenseForSoftware: jest.fn(props => mockGetLicenseForSoftware(props))
}))

const copySoftware = {
  ...useSoftwareToEditData
}

const mockKeywords = [
  ...copySoftware.keywords
]

const mockLicenses = [
  ...copySoftware.licenses
]

// wrap hook into component
function WithUseSoftwareToEditHook(props:any) {
  const {loading,editSoftware} = useSoftwareToEdit(props)

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>{JSON.stringify(editSoftware,null,2)}</div>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders loading', () => {
  const mockProps = {
    slug: 'test-slug',
    token: 'TEST-TOKEN'
  }

  render(
    <WithUseSoftwareToEditHook {...mockProps} />
  )
  const loader = screen.getByText('Loading...')
})

it('renders software returned by api', async() => {
  const mockProps = {
    slug: 'test-slug',
    token: 'TEST-TOKEN'
  }

  // delete copySoftware.keywords
  // delete copySoftware.licenses

  // mock api responses
  mockGetSoftwareToEdit.mockResolvedValueOnce(copySoftware)
  mockGetKeywordsForSoftware.mockResolvedValueOnce(mockKeywords)
  mockGetLicenseForSoftware.mockResolvedValueOnce(mockLicenses)

  render(
    <WithUseSoftwareToEditHook {...mockProps} />
  )

  // validate software id returned
  const softwareId = await screen.findByText(RegExp(copySoftware.id))
})

