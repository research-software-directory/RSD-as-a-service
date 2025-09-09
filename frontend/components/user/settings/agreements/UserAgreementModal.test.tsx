// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserAgrementModal from './UserAgreementModal'

// MOCK useUserAgreements
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUserAgreements = jest.fn(props => {
  return {
    loading: false,
    agree_terms: false,
    notice_privacy_statement: true,
    public_orcid_profile: true
  }
})
const mockPatchAccountTable = jest.fn()

jest.mock('./useUserAgreements', () => ({
  useUserAgreements: (props: any) => mockUserAgreements(props),
  patchAccountTable: (props:any) => mockPatchAccountTable(props)
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders modal when agree_terms=false', async () => {
  // mock values
  mockUserAgreements.mockReturnValueOnce({
    loading: false,
    agree_terms: false,
    notice_privacy_statement: true,
    public_orcid_profile: true
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  await screen.findByTestId('user-agreement-modal')
})

it('renders modal when notice_privacy_statement=false', async() => {
  // mock values
  mockUserAgreements.mockReturnValueOnce({
    loading: false,
    agree_terms: true,
    notice_privacy_statement: false,
    public_orcid_profile: true
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  await screen.findByTestId('user-agreement-modal')
})

it('does not render modal when terms accepted', async() => {
  // mock values (multiple request made)
  mockUserAgreements.mockReturnValue({
    loading: false,
    agree_terms: true,
    notice_privacy_statement: true,
    public_orcid_profile: false
  })
  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  const modal = screen.queryByTestId('user-agreement-modal')
  expect(modal).toBe(null)
})

it('accepts TOS via modal and calls patch account', async() => {
  // mock values
  mockUserAgreements.mockReturnValueOnce({
    loading: false,
    agree_terms: false,
    notice_privacy_statement: true,
    public_orcid_profile: false
  })

  mockPatchAccountTable.mockResolvedValueOnce(() => {
    return {
      status:204
    }
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <UserAgrementModal />
    </WithAppContext>
  )

  await screen.findByTestId('user-agreement-modal')

  const switches = screen.getAllByRole('switch')

  // first switch is agree_terms value we set to false
  const tosSwitch = switches[0]
  expect(tosSwitch).not.toBeChecked()

  // now we check that value
  fireEvent.click(tosSwitch)
  // validate checked
  expect(tosSwitch).toBeChecked()

  // get accept button
  const acceptBtn = screen.getByRole('button', {
    name: 'Accept'
  })
  expect(acceptBtn).toBeEnabled()
  // click on accept
  fireEvent.submit(acceptBtn)

  await waitFor(() => {
    expect(mockPatchAccountTable).toHaveBeenCalledTimes(1)
    expect(mockPatchAccountTable).toHaveBeenCalledWith({
      account: mockSession.user?.account,
      data: {
        agree_terms: true,
        notice_privacy_statement: true,
      },
      token: mockSession.token
    })
  })
})
