// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext} from '~/utils/jest/WithAppContext'

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
      software: []
    })

    render(
      <WithAppContext>
        <UserSoftware />
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('render nothing to show message', () => {
    // return loading
    mockUseUserSoftware.mockReturnValue({
      loading: false,
      software: []
    })

    render(
      <WithAppContext>
        <UserSoftware />
      </WithAppContext>
    )

    screen.getByText('nothing to show')
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
        <UserSoftware />
      </WithAppContext>
    )

    const software = screen.getAllByTestId('software-list-item')
    expect(software.length).toEqual(softwareByMaintainer.length)
  })

})
