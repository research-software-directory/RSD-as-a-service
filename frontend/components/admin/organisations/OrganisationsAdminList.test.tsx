// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import OrganisationsAdminList from './OrganisationsAdminList'

// MOCKS
import mockOrganisationList from '../../../utils/jest/__mocks__/organisationsOverview.json'
const mockOnDelete = jest.fn()
const mockProps = {
  loading: true,
  organisations: mockOrganisationList as any,
  onDeleteOrganisation: mockOnDelete,
  page: 0
}


beforeEach(() => {
  jest.resetAllMocks()
})

it('renders loader on loading', () => {
  mockProps.loading = true
  render(
    <OrganisationsAdminList {...mockProps} />
  )

  screen.getByRole('progressbar')
  // screen.debug()
})


it('renders list of organisations passed in props', () => {
  mockProps.loading = false

  render(
    <OrganisationsAdminList {...mockProps} />
  )

  const items = screen.getAllByTestId('admin-organisation-item')
  expect(items.length).toEqual(mockProps.organisations.length)
  // screen.debug()
})
