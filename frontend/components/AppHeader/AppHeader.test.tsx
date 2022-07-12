import {render, screen} from '@testing-library/react'

import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {menuItems} from '~/config/menuItems'
import AppHeader from './index'

beforeEach(() => {
  render(WrappedComponentWithProps(AppHeader))
})

it('renders AppHeader with header tag', () => {
  // has header
  const header = screen.getByRole('banner')
  expect(header).toBeInTheDocument()
})

it('renders AppHeader with 2 searchboxes', () => {
  // has searchbox
  const search = screen.getAllByRole('searchbox')
  // two searchboxes, one for mobile and one for larger screens?!?
  expect(search).toHaveLength(2)
})

it('renders AppHeader with links', () => {
  // has searchbox
  const links = screen.getAllByRole('link')
  // menu items + logo link to root
  expect(links).toHaveLength(menuItems.length + 1)
  // screen.debug()
})

it('renders AppHeader with links', () => {
  // has searchbox
  const links = screen.getAllByRole('link')
  // menu items + logo link to root
  expect(links).toHaveLength(menuItems.length + 1)
  // screen.debug()
})

it('renders AppHeader with mobile menu', () => {
  // has searchbox
  const menu = screen.getByTestId('mobile-menu')
  // menu items + logo link to root
  expect(menu).toBeInTheDocument()
  // screen.debug()
})


