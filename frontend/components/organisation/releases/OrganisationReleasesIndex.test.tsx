// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationSoftwareReleases from './index'
import {Session} from '~/auth'

// MOCKS
import mockOrganisation from '~/components/organisation/__mocks__/mockOrganisation'
import mockReleaseCount from './__mocks__/release_cnt_by_year.json'
import mockReleases from './__mocks__/releases_by_organisation.json'

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_user'
  }
} as Session

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// mock api - default mock
jest.mock('~/components/organisation/releases/apiOrganisationReleases')

describe('components/organisation/releases/index.tsx', () => {

  it('shows releases page', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSoftwareReleases releaseCountsByYear={mockReleaseCount} releases={mockReleases} />
        </WithOrganisationContext>
      </WithAppContext>
    )

    // buttons
    const years = screen.getAllByRole('release-year-button')
    expect(years.length).toEqual(mockReleaseCount.length)

    // find release items
    const releases = await screen.findAllByTestId('release-item')
    // validate all items are shown
    expect(releases.length).toEqual(mockReleases.length)
  })

})
