// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserOrganisations from './index'

// MOCKS
import organisationByMaintainer from './__mocks__/organisationsByMaintainer.json'

const mockGetOrganisationsForMaintainer = jest.fn(props => Promise.resolve([] as any))
const mockUseUserOrganisations = jest.fn()

jest.mock('./useUserOrganisations', () => ({
  __esModule: true,
  default: jest.fn(props=>mockUseUserOrganisations(props)),
  getOrganisationsForMaintainer: jest.fn(props => mockGetOrganisationsForMaintainer(props))
}))

describe('components/user/organisations/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('render loader', () => {
    // return loading
    mockUseUserOrganisations.mockReturnValue({
      loading: true,
      organisations: [],
      count: 0
    })

    render(
      <WithAppContext>
        <UserOrganisations session={mockSession} />
      </WithAppContext>
    )

    const loader = screen.getByRole('progressbar')
  })

  it('render nothing to show message', () => {
    // return loading
    mockUseUserOrganisations.mockReturnValue({
      loading: false,
      organisations: [],
      count: 0
    })

    render(
      <WithAppContext>
        <UserOrganisations session={mockSession} />
      </WithAppContext>
    )

    const noItems = screen.getByText('nothing to show')
  })

  it('render organisation cards', () => {
    // return loading
    mockUseUserOrganisations.mockReturnValue({
      loading: false,
      organisations: organisationByMaintainer,
      count: organisationByMaintainer.length
    })

    render(
      <WithAppContext>
        <UserOrganisations session={mockSession} />
      </WithAppContext>
    )

    const organisations = screen.getAllByTestId('organisation-card-link')
    expect(organisations.length).toEqual(organisationByMaintainer.length)
  })

})
