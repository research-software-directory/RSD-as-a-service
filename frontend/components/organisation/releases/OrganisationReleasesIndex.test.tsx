// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

// DEFAULT MOCKS returning jest.fn()
// MOCK getUserSettings
jest.mock('~/components/user/ssrUserSettings')
// MOCK getActiveModuleNames
jest.mock('~/config/getSettingsServerSide')
// MOCK getReleasesCountForOrganisation, getReleasesForOrganisation
jest.mock('~/components/organisation/releases/apiOrganisationReleases')
// MOCK getOrganisationIdForSlug
jest.mock('~/components/organisation/apiOrganisations')

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


describe('components/organisation/releases/index.tsx', () => {

  it('shows releases page', async() => {

    const ResolvedPage = await OrganisationSoftwareReleases({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: testSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // buttons
    const years = screen.getAllByRole('release-year-button')
    // NOTE! one period is loaded and therefore not a button hence length-1
    expect(years.length).toEqual(mockReleaseCount.length - 1)

    // find release items
    const releases = await screen.findAllByTestId('release-item')
    // validate all items are shown
    expect(releases.length).toEqual(mockReleases.length)
  })

})
