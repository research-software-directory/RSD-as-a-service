import {render,screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import UserMenu from './UserMenu'
import {userMenuItems} from '../../config/userMenuItems'

it('should render userMenu',()=>{
  render(WrappedComponentWithProps(UserMenu))
  const userMenu = screen.queryByTestId('user-menu-button')
  expect(userMenu).toBeInTheDocument()
  // screen.debug()
})

it('should have userMenu options',async()=>{
  render(WrappedComponentWithProps(UserMenu, {menuOptions: userMenuItems}))
  const menuButton = screen.queryByTestId('user-menu-button')
  // click on the button to display menu options
  fireEvent.click(menuButton)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('user-menu-option')
  // assert same length as defined in config/userMenuItems
  expect(menuOptions.length).toEqual(userMenuItems.length)
  // screen.debug()
})
