import {render,screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import AddMenu from './AddMenu'
import {addMenuItems} from '../../config/addMenuItems'

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
  fireEvent.click(menuButton)
  // select all menu options
  const menuOptions = screen.queryAllByTestId('add-menu-option')
  // assert same length as defined in config/userMenuItems
  expect(menuOptions.length).toEqual(addMenuItems.length)
  // screen.debug()
})
