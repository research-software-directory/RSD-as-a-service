// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserSoftware from './index'

import softwareByMaintainer from './__mocks__/softwareByMaintainer.json'
const mockUseUserSoftware = jest.fn()
jest.mock('./useUserSoftware', () => ({
  __esModule: true,
  default: jest.fn(props=>mockUseUserSoftware(props))
}))
describe('components/user/software/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('render loader', () => {
    // return loading
    mockUseUserSoftware.mockReturnValue({
      loading: true,
      software: [],
      count: 0
    })

    render(
      <WithAppContext>
        <UserSoftware session={mockSession} />
      </WithAppContext>
    )

    const loader = screen.getByRole('progressbar')
  })

  it('render nothing to show message', () => {
    // return loading
    mockUseUserSoftware.mockReturnValue({
      loading: false,
      software: [],
      count: 0
    })

    render(
      <WithAppContext>
        <UserSoftware session={mockSession} />
      </WithAppContext>
    )

    const noItems = screen.getByText('nothing to show')
  })

  it('render software cards', () => {
    // return loading
    mockUseUserSoftware.mockReturnValue({
      loading: false,
      software: softwareByMaintainer,
      count: softwareByMaintainer.length
    })

    render(
      <WithAppContext>
        <UserSoftware session={mockSession} />
      </WithAppContext>
    )

    const software = screen.getAllByTestId('software-card-link')
    expect(software.length).toEqual(softwareByMaintainer.length)
  })

})
