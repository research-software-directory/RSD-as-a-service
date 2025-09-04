// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {Matomo} from './nodeCookies'
import {initMatomoCustomUrl} from './setMatomoPage'

let setCustomUrl:(matomo:Matomo)=>void

// mock push fn
const mockPush = jest.fn()
// mock matomo object _paq
Object.defineProperty(window, '_paq', {
  value: {
    push: mockPush,
  }
})

beforeEach(() => {
  setCustomUrl = initMatomoCustomUrl()
})

it('does not trigger action when matomo.id is null', () => {
  const matomo = {
    id: null,
    consent:null
  }
  setCustomUrl(matomo)
  expect(mockPush).not.toHaveBeenCalled()
})

it('does not trigger action when matomo.consent is false', () => {
  const matomo = {
    id: 'test-id',
    consent: false
  }
  setCustomUrl(matomo)
  expect(mockPush).not.toHaveBeenCalled()
})

// This test ensures that we push custom page only after inital
// page load. At initial page load piwik.js script will report that
// page automatically. After that we need to push customUrl change on our
// because we use SPA router (next.router) for navigation
// https://morgan.cugerone.com/blog/quick-tip-jest-used-with-jsdom-as-environment-does-not-support-navigation-full-stop/
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
it.skip('push custom page to matomo ONLY after initial url changed', () => {
  const matomo = {
    id: 'test-id',
    consent: true
  }
  setCustomUrl(matomo)
  // this will not trigger call to _paq
  // because previousUrl is null unchanged
  expect(mockPush).not.toHaveBeenCalled()
  // move to another location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://test.com/page1',
    }
  })
  setCustomUrl(matomo)
  // calls push 4 times to setReferrerUrl,
  // setCustomUrl, setDocumentTitle, trackPageView
  expect(mockPush).toHaveBeenCalledTimes(4)
})
