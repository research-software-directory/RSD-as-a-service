// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {Session} from '~/auth'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AdminSoftwareHighlightsPage from './index'

// MOCKS
import mockSoftwareHighlight from './__mocks__/software_for_highlight.json'
// default api mock
jest.mock('~/components/admin/software-highlights/apiSoftwareHighlights')

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session

describe('components/admin/software-highlights/index.tsx', () => {

  it('shows progressbar initially', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminSoftwareHighlightsPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
  })

  it('shows first 12 contributors in table', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminSoftwareHighlightsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const rows = screen.getAllByTestId('admin-highlight-item')
    expect(rows.length).toEqual(mockSoftwareHighlight.length)
    // screen.debug(rows)
  })

  it('can remove software from highlight', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminSoftwareHighlightsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const rows = screen.getAllByTestId('admin-highlight-item')
    expect(rows.length).toEqual(mockSoftwareHighlight.length)

    const deleteBtn = within(rows[0]).getByRole('button',{name:'delete'})
    fireEvent.click(deleteBtn)

    await waitFor(async() => {
      // get confirm delete
      const confirmDelete = screen.getByRole('dialog')
      // confirm first account from list - listed twice in modal
      screen.getAllByText(mockSoftwareHighlight[0].brand_name)
      // confirm remove
      const removeBtn = within(confirmDelete).getByRole('button', {name: 'Remove'})
      fireEvent.click(removeBtn)
      await waitForElementToBeRemoved(confirmDelete)
      // screen.debug(confirmDelete)
    })
  })
})
