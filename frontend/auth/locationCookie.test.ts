// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

// https://morgan.cugerone.com/blog/quick-tip-jest-used-with-jsdom-as-environment-does-not-support-navigation-full-stop/
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/

import {saveLocationCookie} from './locationCookie'

const orgLocation = window.location

beforeAll(() => {
  // mock location
  Object.defineProperty(window, 'location', {
    value: new URL('http://localhost'),
    configurable: true,
  })
  // mock cookie
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'status=active',
  })
})

afterAll(() => {
  // reset location
  Object.defineProperty(window, 'location', orgLocation)
})

it.skip('ignores these paths', () => {
  const ignorePath = [
    '/auth',
    '/login',
    '/logout',
    '/login/local',
    '/login/failed'
  ]
  ignorePath.forEach(path => {
    // console.log('loop...', path)
    // should ignore this path
    window.location.pathname = path
    document.cookie = ''
    // call function
    saveLocationCookie()
    // validate
    expect(document.cookie).toEqual('')
  })
})

it.skip('when root write cookie to redirect to software', () => {
  // should ignore this path
  window.location.pathname = '/'
  const expectedCookie = 'rsd_pathname=http://localhost/user/software;path=/auth;SameSite=None;Secure'
  document.cookie = ''
  // call function
  saveLocationCookie()
  // validate
  expect(document.cookie).toEqual(expectedCookie)
})

it.skip('when path write cookie to redirect to path', () => {
  // should ignore this path
  const testPath = '/test-path'
  window.location.pathname = testPath
  const expectedCookie = `rsd_pathname=http://localhost${testPath};path=/auth;SameSite=None;Secure`
  document.cookie = ''
  // call function
  saveLocationCookie()
  // validate
  expect(document.cookie).toEqual(expectedCookie)
})
