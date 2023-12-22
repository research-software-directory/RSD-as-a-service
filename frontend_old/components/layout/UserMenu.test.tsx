// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import UserMenu from './UserMenu'
import {getUserMenuItems} from '~/config/userMenuItems'

const userMenuItems = getUserMenuItems()

it('should render userMenu', () => {
  render(WrappedComponentWithProps(UserMenu))
  const userMenu = screen.queryByTestId('user-menu-button')
  expect(userMenu).toBeInTheDocument()
  // screen.debug()
})

it('should have userMenu options',async()=>{
  render(WrappedComponentWithProps(UserMenu, {
    props: {menuOptions: userMenuItems}
  }))
  const menuButton = screen.queryByTestId('user-menu-button')
  // click on the button to display menu options
  expect(menuButton).toBeInTheDocument()
  fireEvent.click(menuButton as HTMLElement)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('user-menu-option')
  // assert same length as defined in config/userMenuItems
  const menuItems = userMenuItems.filter(item=>item?.type!=='divider')
  expect(menuOptions.length).toEqual(menuItems.length)
  // screen.debug()
})
