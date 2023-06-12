// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {saveLocationCookie} from './locationCookie'

const orgLocation = window.location
const orgCookie = document.cookie

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

it('ignores these paths', () => {
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

it('when root write cookie to redirect to software', () => {
  // should ignore this path
  window.location.pathname = '/'
  const expectedCookie = 'rsd_pathname=http://localhost/software;path=/auth;SameSite=None;Secure'
  document.cookie = ''
  // call function
  saveLocationCookie()
  // validate
  expect(document.cookie).toEqual(expectedCookie)
})

it('when path write cookie to redirect to path', () => {
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
