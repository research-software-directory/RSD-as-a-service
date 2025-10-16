// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import CookieConsentMatomo from './CookieConsentMatomo'

// MOCKS
// mocked! next/navigation
import {usePathname,useSearchParams} from 'next/navigation'
// mock matomo script function
const mockSetValue = jest.fn()
window._paq = {push:mockSetValue} // NOSONAR
// mock document title
document.title='test title'

beforeAll(()=>{
  jest.resetAllMocks()
})

it('should not render if no matomo.id provided', () => {
  const matomo = {
    id: null,
    consent: null
  }
  // mock / route
  usePathname.mockReturnValue('/')
  render(<CookieConsentMatomo matomo={matomo} />)
  const consentModal = screen.queryByTestId('cookie-consent-matomo')
  expect(consentModal).toBeNull()
  // screen.debug()
})

it('should not render on cookies route', () => {

  const matomo = {
    id: 'test',
    consent: null
  }
  // mock /cookies route
  usePathname.mockReturnValue('/cookies')
  //  route="/cookies"
  render(<CookieConsentMatomo matomo={matomo} />)
  const consentModal = screen.queryByTestId('cookie-consent-matomo')
  expect(consentModal).toBeNull()
})

it('should render Accept and Decline buttons when id present and consent missing', async() => {
  const matomo = {
    id: 'test',
    consent: null
  }
  // mock / route
  usePathname.mockReturnValue('/')
  render(<CookieConsentMatomo matomo={matomo} />)
  const consentModal = screen.getByTestId('cookie-consent-matomo')
  expect(consentModal).toBeInTheDocument()

  // we need to use hidden due to incorrect aria-hidden="true"
  const acceptBtn = await screen.findByRole('button', {
    name: 'Accept',
    hidden: true
  })
  expect(acceptBtn).toBeInTheDocument()

  // we need to use hidden due to incorrect aria-hidden="true"
  const declineBtn = await screen.findByRole('button', {
    name: 'Decline',
    hidden: true
  })
  expect(declineBtn).toBeInTheDocument()
  // screen.debug()
})

it('should pass route change to matomo using setValue',()=>{
  const matomo = {
    id: 'test',
    consent: true
  }
  // return / path
  usePathname.mockReturnValue('/')
  // return search params
  useSearchParams.mockReturnValue(['search'])

  // render
  render(<CookieConsentMatomo matomo={matomo} />)
  // 3 calls: setCustomUrl,setDocumentTitle and trackPageView
  expect(mockSetValue).toHaveBeenCalled()
  // validate at least custom url and page title
  expect(mockSetValue).toHaveBeenCalledWith(['setCustomUrl','http://localhost/'])
  expect(mockSetValue).toHaveBeenCalledWith(['setDocumentTitle',document.title])
})
