// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {Session} from '~/auth'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import RsdContributorsPage from './index'

// MOCKS
import mockContributors from './__mocks__/person_mentions.json'
const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session

jest.mock('~/components/admin/rsd-contributors/apiRsdContributors')

describe('components/admin/rsd-contributors/index.tsx', () => {

  it('shows progressbar initially', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdContributorsPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
  })

  it('shows first 12 contributors in table', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdContributorsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const rows = screen.getAllByTestId('mui-table-body-row')
    expect(rows.length).toEqual(mockContributors.length)
    // screen.debug(rows)
  })

  it('shows avatar menu options', async()=>{
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdContributorsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // it should have menu options based on mocked data file person_mentions.json
    // const options = await screen.findAllByTestId('avatar-menu-options')
    // screen.debug(options)
    const optionsBtn = screen.getAllByTestId('avatar-options')
    // click on options button
    fireEvent.click(optionsBtn[0])

    // get menu items (it should be 1 option)
    const options = await screen.findAllByTestId('avatar-menu-option')
    expect(options.length).toBeGreaterThanOrEqual(1)

    // it should also have option to remove avatar
    screen.getByTestId('remove-avatar-option')
  })
})
