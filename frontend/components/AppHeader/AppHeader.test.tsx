// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext} from '~/utils/jest/WithAppContext'
import defaultSettings from '~/config/defaultSettings.json'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
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
  jest.clearAllMocks()
  render(
    <WithAppContext options={{
      settings: defaultSettings as RsdSettingsState
    }}>
      <AppHeader />
    </WithAppContext>
  )
})

it('renders AppHeader with header tag', () => {
  // has header
  const header = screen.getByRole('banner')
  expect(header).toBeInTheDocument()
})

it('renders AppHeader with 2 search boxes', () => {
  // has searchbox
  const search = screen.getAllByTestId('global-search')
  // two search boxes, one for mobile and one for larger screens?!?
  expect(search).toHaveLength(2)
})

it('renders AppHeader with links to defined modules and logo link', () => {
  // has searchbox
  const links = screen.getAllByRole('link')
  // menu items defined in modules + logo link + feedback link
  expect(links).toHaveLength(defaultSettings.host.modules.length + 2)
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
