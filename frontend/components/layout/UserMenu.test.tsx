// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen, fireEvent} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserMenu from './UserMenu'

it('should render userMenu', () => {
  render (
    <WithAppContext options={{session:mockSession}}>
      <UserMenu />
    </WithAppContext>
  )
  const userMenu = screen.queryByTestId('user-menu-button')
  expect(userMenu).toBeInTheDocument()
})

it('should have 5 userMenu options',async()=>{
  // mockSession?.user?.role='rsd_admin'
  render (
    <WithAppContext options={{session:mockSession}}>
      <UserMenu />
    </WithAppContext>
  )

  const menuButton = screen.queryByTestId('user-menu-button')
  // click on the button to display menu options
  expect(menuButton).toBeInTheDocument()
  fireEvent.click(menuButton as HTMLElement)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('user-menu-option')
  // based on default user session the menu should have 5 items
  expect(menuOptions.length).toEqual(5)
})
