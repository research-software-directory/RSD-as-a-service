// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// api mock
jest.mock('~/components/admin/announcements/useAnnouncement')

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AdminAnnouncementsPage from '~/components/admin/announcements/index'
import {Session} from '~/auth'

// MOCKS
import {mockAnnouncement} from './__mocks__/apiAnnouncement'
import useAnnouncement from '~/components/admin/announcements/useAnnouncement'
const mockUseAnnouncement = useAnnouncement as jest.Mock

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session


describe('components/admin/announcements/index.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows progressbar initially', () => {
    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnouncementsPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
  })


  it('shows announcement returned from api', () => {

    mockUseAnnouncement.mockReturnValue({
      loading:false,
      announcement: mockAnnouncement
    })

    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnouncementsPage />
      </WithAppContext>
    )

    // wait for loader to be removed
    // await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get switch
    const visible = screen.getByRole('switch')
    // validate is ON
    expect(visible).toBeChecked()
    // get text
    const announcement = screen.getByRole<HTMLInputElement>('textbox')
    // validate text returmed from mocked api
    expect(announcement.value).toEqual(mockAnnouncement.text)

    const saveBtn = screen.getByRole('button', {name: 'Save'})
    expect(saveBtn).toBeDisabled()
    // screen.debug()
  })

  it('can turn off announcement', async () => {

    mockUseAnnouncement.mockReturnValue({
      loading:false,
      announcement: mockAnnouncement
    })

    render(
      <WithAppContext options={{session: testSession}}>
        <AdminAnnouncementsPage />
      </WithAppContext>
    )

    // get switch
    const visible = screen.getByRole('switch')
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
