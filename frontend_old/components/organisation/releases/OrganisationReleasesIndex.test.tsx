// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
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

  it('shows loader', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSoftwareReleases />
        </WithOrganisationContext>
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('shows releases page', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSoftwareReleases />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // buttons
    const years = screen.getAllByRole('button')
    expect(years.length).toEqual(mockReleaseCount.length)

    // find release items
    const releases = await screen.findAllByTestId('release-item')
    // validate all items are shown
    expect(releases.length).toEqual(mockReleases.length)
  })

})
