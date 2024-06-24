// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserProjects from './index'

import communitiesByMaintainer from './__mocks__/communitiesByMaintainer.json'
const mockUseUserCommunities = jest.fn()
jest.mock('./useUserCommunities', () => ({
  __esModule: true,
  default: jest.fn(props=>mockUseUserCommunities(props))
}))
describe('components/user/communities/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('render loader', () => {
    // return loading
    mockUseUserCommunities.mockReturnValue({
      loading: true,
      communities: []
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserProjects />
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('render nothing to show message', () => {
    // return loading
    mockUseUserCommunities.mockReturnValue({
      loading: false,
      communities: []
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserProjects />
      </WithAppContext>
    )

    screen.getByText('nothing to show')
  })

  it('render community list', () => {
    // return loading
    mockUseUserCommunities.mockReturnValue({
      loading: false,
      communities: communitiesByMaintainer
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserProjects />
      </WithAppContext>
    )

    const communities = screen.getAllByTestId('community-list-item')
    expect(communities.length).toEqual(communitiesByMaintainer.length)
  })

})
