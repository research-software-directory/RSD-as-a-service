// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import AddMenu from '../AppHeader/AddMenu'

it('should render AddMenu',()=>{
  render(WrappedComponentWithProps(AddMenu))
  const userMenu = screen.queryByTestId('add-menu-button')
  expect(userMenu).toBeInTheDocument()
  // screen.debug()
})

it('should have AddMenu options',async()=>{
  render(WrappedComponentWithProps(AddMenu))
  const menuButton = screen.queryByTestId('add-menu-button')
  // click on the button to display menu options
  fireEvent.click(menuButton as HTMLElement)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('add-menu-option')
  // assert only 2 items
  expect(menuOptions.length).toEqual(2)
  // screen.debug()
})
