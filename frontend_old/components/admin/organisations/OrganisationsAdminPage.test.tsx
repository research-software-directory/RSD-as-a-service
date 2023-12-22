// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {Session} from '~/auth'

import OrganisationsAdminPage from './index'

// MOCKS
import mockOrganisationList from '../../../__tests__/__mocks__/organisationsOverview.json'
const mockUseOrganisation = jest.fn()
jest.mock('./apiOrganisation', () => ({
  useOrganisations:(token:string)=>mockUseOrganisation(token)
}))

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session

const mockAddOrganisation = jest.fn()
const mockRemoveOrganisation = jest.fn()
const mockUseResponse = {
  loading:true,
  organisations:mockOrganisationList,
  addOrganisation:mockAddOrganisation,
  removeOrganisation:mockRemoveOrganisation
}


describe('components/admin/organisations/index.tsx', () => {

  it('shows progressbar initialy', () => {
    mockUseResponse.loading=true
    // mock hook response
    mockUseOrganisation.mockReturnValueOnce(mockUseResponse)

    render(
      <WithAppContext options={{session: testSession}}>
        <OrganisationsAdminPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
    // screen.debug()
  })

  it('shows list of organisations', () => {
    mockUseResponse.loading=false
    // mock hook response
    mockUseOrganisation.mockReturnValueOnce(mockUseResponse)

    render(
      <WithAppContext options={{session: testSession}}>
        <OrganisationsAdminPage />
      </WithAppContext>
    )

    const items = screen.getAllByTestId('admin-organisation-item')
    expect(items.length).toEqual(mockUseResponse.organisations.length)
  })
})
