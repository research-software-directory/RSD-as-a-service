// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AdminAnnoucementsPage from '~/components/admin/announcements/index'
import {Session} from '~/auth'

// MOCKS
import {mockAnnoucement} from './__mocks__/apiAnnouncement'
// api mock
jest.mock('~/components/admin/announcements/apiAnnouncement')

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session


describe('components/admin/announcements/index.tsx', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows progressbar initialy', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnoucementsPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
    // screen.debug()
  })


  it('shows announcement returned from api', async() => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnoucementsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get switch
    const visible = screen.getByRole('checkbox')
    // validate is ON
    expect(visible).toBeChecked()
    // get text
    const announcement = screen.getByRole<HTMLInputElement>('textbox')
    // validate text returmed from mocked api
    expect(announcement.value).toEqual(mockAnnoucement.text)

    const saveBtn = screen.getByRole('button', {name: 'Save'})
    expect(saveBtn).toBeDisabled()
    // screen.debug()
  })

  it('can turn off announcement', async () => {

    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnoucementsPage />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get switch
    const visible = screen.getByRole('checkbox')
    // validate is ON
    expect(visible).toBeChecked()

    // initially save button is disabled
    const saveBtn = screen.getByRole('button', {name: 'Save'})
    expect(saveBtn).toBeDisabled()

    // uncheck visible switch
    fireEvent.click(visible)

    await waitFor(() => {
      // save button should be enabled
      expect(saveBtn).toBeEnabled()
      // click on save button
      fireEvent.click(saveBtn)
    })
  })
})
