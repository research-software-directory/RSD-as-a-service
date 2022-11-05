// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {menuItems} from '~/config/menuItems'
import AppHeader from './index'

// mocks login providers list
const redirectUrl = 'https://test-login-redirect.com'
jest.mock('~/auth/api/useLoginProviders', () => {
  return ()=>[{
    name: 'test provider',
    redirectUrl
  }]
})

beforeEach(() => {
  render(WrappedComponentWithProps(AppHeader,))
})

it('renders AppHeader with header tag', () => {
  // has header
  const header = screen.getByRole('banner')
  expect(header).toBeInTheDocument()
})

it('renders AppHeader with 2 searchboxes', () => {
  // has searchbox
  const search = screen.getAllByTestId('global-search')
  // two searchboxes, one for mobile and one for larger screens?!?
  expect(search).toHaveLength(2)
})

it('renders AppHeader with links and logo link', () => {
  // has searchbox
  const links = screen.getAllByRole('link')
  // menu items + logo link + feedback link
  expect(links).toHaveLength(menuItems.length + 2)
  // screen.debug()
})

it('renders AppHeader with Sign in link', async() => {
  // has searchbox
  const link = await screen.findByText('Sign in')
  // link should exists
  expect(link).toBeInTheDocument()
  // and have value of redirectUrl
  expect(link).toHaveAttribute('href',redirectUrl)
})
