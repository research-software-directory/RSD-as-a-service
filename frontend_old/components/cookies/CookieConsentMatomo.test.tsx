// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'

import CookieConsentMatomo from './CookieConsentMatomo'

it('should not render if no matomo.id provided', () => {
  const matomo = {
    id: null,
    consent: null
  }
  render(<CookieConsentMatomo matomo={matomo} route="/" />)
  const consentModal = screen.queryByTestId('cookie-consent-matomo')
  expect(consentModal).toBeNull()
  // screen.debug()
})

it('should not render on cookies route', () => {
  const matomo = {
    id: 'test',
    consent: null
  }
  render(<CookieConsentMatomo matomo={matomo} route="/cookies" />)
  const consentModal = screen.queryByTestId('cookie-consent-matomo')
  expect(consentModal).toBeNull()
})

it('should render Accept and Decline buttons when id present and consent missing', async() => {
  const matomo = {
    id: 'test',
    consent: null
  }
  render(<CookieConsentMatomo matomo={matomo} route="/" />)
  const consentModal = screen.getByTestId('cookie-consent-matomo')
  expect(consentModal).toBeInTheDocument()

  // we need to use hidden due to incorect aria-hidden="true"
  const acceptBtn = await screen.findByRole('button', {
    name: 'Accept',
    hidden: true
  })
  expect(acceptBtn).toBeInTheDocument()

  // we need to use hidden due to incorect aria-hidden="true"
  const declineBtn = await screen.findByRole('button', {
    name: 'Decline',
    hidden: true
  })
  expect(declineBtn).toBeInTheDocument()
  // screen.debug()
})
