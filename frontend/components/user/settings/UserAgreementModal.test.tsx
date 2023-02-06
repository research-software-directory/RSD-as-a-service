// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserAgrementModal from './UserAgreementModal'

// MOCK fetchAgreementStatus
const mockFetchAgreementStatus = jest.fn()
jest.mock('./fetchAgreementStatus', () => ({
  fetchAgreementStatus:jest.fn(props=>mockFetchAgreementStatus(props))
}))

// MOCK patchAccountTable
const mockPatchAccountTable = jest.fn()
jest.mock('./patchAccountTable', () => ({
  patchAccountTable:jest.fn(props=>mockPatchAccountTable(props))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders modal when agree_terms=false', async() => {

  mockFetchAgreementStatus.mockResolvedValueOnce({
    status: 200,
    data: {
      agree_terms: false,
      notice_privacy_statement: true
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = await screen.findByTestId('user-agreement-modal')
})

it('renders modal when notice_privacy_statement=false', async() => {

  mockFetchAgreementStatus.mockResolvedValueOnce({
    status: 200,
    data: {
      agree_terms: true,
      notice_privacy_statement: false
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = await screen.findByTestId('user-agreement-modal')
})

it('does not render modal when terms accepted', async() => {

  mockFetchAgreementStatus.mockResolvedValueOnce({
    status: 200,
    data: {
      agree_terms: true,
      notice_privacy_statement: true
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = await screen.queryByTestId('user-agreement-modal')
  expect(modal).toBe(null)
})

it('does not render modal when role rsd_admin', async () => {
  // role is rsd_admin
  if (mockSession.user && mockSession.user.role) {
    mockSession.user.role = 'rsd_admin'
  }

  mockFetchAgreementStatus.mockResolvedValueOnce({
    status: 200,
    data: {
      agree_terms: false,
      notice_privacy_statement: false
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = await screen.queryByTestId('user-agreement-modal')
  expect(modal).toBe(null)
})

it('accepts TOS via modal and calls patch account', async() => {
  // role is rsd_admin
  if (mockSession.user && mockSession.user.role) {
    mockSession.user.role = 'rsd_user'
  }

  mockFetchAgreementStatus.mockResolvedValueOnce({
    status: 200,
    data: {
      agree_terms: false,
      notice_privacy_statement: true
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = await screen.findByTestId('user-agreement-modal')

  const switches = screen.getAllByRole('checkbox')

  // first switch is agree_terms value we set to false
  const tosSwitch = switches[0]
  expect(tosSwitch).not.toBeChecked()

  // now we check that value
  fireEvent.click(tosSwitch)
  // validate checked
  expect(tosSwitch).toBeChecked()
  // loose focus
  fireEvent.blur(tosSwitch)

  await waitFor(() => {
    expect(mockPatchAccountTable).toBeCalledTimes(1)
    expect(mockPatchAccountTable).toBeCalledWith({
      'account': mockSession.user?.account,
      'data': {
        'agree_terms': true,
      },
      'token': mockSession.token
    })
  })

})
