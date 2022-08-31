// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import CookiesPage from '../pages/cookies'

it('renders cookies page with title Cookies', async() => {
  const props = {
    matomoId: null,
    matomoConsent: null
  }
  render(WrappedComponentWithProps(
    CookiesPage, {
    props
  }))
  const heading = await screen.findByRole('heading',{
    name: 'Cookies'
  })
  expect(heading).toBeInTheDocument()
  expect(heading.innerHTML).toEqual('Cookies')
})


it('renders cookies page with anonymous statistics checkbox ON', async() => {
  const props = {
    matomoId: 'test',
    matomoConsent: true
  }
  render(WrappedComponentWithProps(
    CookiesPage, {
    props
  }))

  const heading = await screen.findByRole('heading',{
    name: 'Tracking cookies'
  })
  expect(heading).toBeInTheDocument()


  const checkbox = await screen.findByRole('checkbox', {
    checked:true
  })
  expect(checkbox).toBeInTheDocument()
})

it('renders cookies page with anonymous statistics checkbox OFF', async() => {
  const props = {
    matomoId: 'test',
    matomoConsent: false
  }
  render(WrappedComponentWithProps(
    CookiesPage, {
    props
  }))

  const checkbox = await screen.findByRole('checkbox', {
    checked:false
  })
  expect(checkbox).toBeInTheDocument()
})
