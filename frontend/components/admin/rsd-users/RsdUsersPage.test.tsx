// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {Session} from '~/auth'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import RsdUsersPage from './index'

// MOCKS
import mockAccounts from './__mocks__/account.json'
const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session


jest.mock('~/components/admin/rsd-users/apiRsdUsers')

describe('components/admin/rsd-users/index.tsx', () => {

  it('shows progressbar initialy', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdUsersPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
  })

  it('shows first 12 accounts in table', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdUsersPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const rows = screen.getAllByTestId('account-item')
    expect(rows.length).toEqual(mockAccounts.length)
    // screen.debug(rows)
  })

  it('can delete first account', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <RsdUsersPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const rows = screen.getAllByTestId('account-item')
    expect(rows.length).toEqual(mockAccounts.length)

    const deleteBtn = within(rows[0]).getByRole('button',{name:'delete'})
    fireEvent.click(deleteBtn)

    await waitFor(async() => {
      // get confirm delete
      const confirmDelete = screen.getByRole('dialog')
      // confirm first account from list - listed twice in modal
      screen.getAllByText(mockAccounts[0].id)
      // confirm remove
      const removeBtn = within(confirmDelete).getByRole('button', {name: 'Remove'})
      fireEvent.click(removeBtn)
      await waitForElementToBeRemoved(confirmDelete)
      // screen.debug(confirmDelete)
    })
  })
})

