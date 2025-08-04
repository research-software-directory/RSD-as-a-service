// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen, fireEvent} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {defaultRsdSettings, RsdSettingsState} from '~/config/rsdSettingsReducer'
import AddMenu from './AddMenu'

const mockSettings:RsdSettingsState = {
  ...defaultRsdSettings
}

it('should render AddMenu',()=>{
  render(
    <WithAppContext>
      <AddMenu />
    </WithAppContext>
  )
  const userMenu = screen.queryByTestId('add-menu-button')
  expect(userMenu).toBeInTheDocument()
  // screen.debug()
})

it('all menu options for rsd-admin',async()=>{
  // admin should have more items
  if (mockSession.user) mockSession.user.role='rsd_admin'

  render(
    <WithAppContext options={{
      session: mockSession,
      settings: mockSettings
    }}>
      <AddMenu />
    </WithAppContext>
  )
  const menuButton = screen.queryByTestId('add-menu-button')
  // click on the button to display menu options
  fireEvent.click(menuButton as HTMLElement)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('add-menu-option')
  // assert 3 menu options [software,projects,news]
  expect(menuOptions.length).toEqual(3)
  // screen.debug()
})

it('no news option for rsd-user',async()=>{
  // admin should have more items
  if (mockSession.user) mockSession.user.role='rsd_user'

  render(
    <WithAppContext options={{
      session: mockSession,
      settings: mockSettings
    }}>
      <AddMenu />
    </WithAppContext>
  )
  const menuButton = screen.queryByTestId('add-menu-button')
  // click on the button to display menu options
  fireEvent.click(menuButton as HTMLElement)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('add-menu-option')
  // assert 2 menu options [software,projects]
  expect(menuOptions.length).toEqual(2)
  // screen.debug()
})
