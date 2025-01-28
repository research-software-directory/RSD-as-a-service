// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {setContentSecurityPolicyHeader} from './contentSecurityPolicy'

const mockSetHeader = jest.fn()

const res = {
  setHeader: mockSetHeader
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('sets content security policy header for development', () => {
  const nonce = setContentSecurityPolicyHeader(res as any)
  const policyName = 'Content-Security-Policy-Report-Only'
  const policyText = `default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; base-uri 'none'; object-src 'none'; script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https:`

  expect(mockSetHeader).toHaveBeenCalledTimes(1)
  // const calledWith = mockSetHeader
  expect(mockSetHeader).toHaveBeenCalledWith(policyName,policyText)
})

it('sets content security policy header for production', () => {
  process.env.NODE_ENV = 'production'
  process.env.MATOMO_URL = 'https://mamtomo.com/test-url'
  const nonce = setContentSecurityPolicyHeader(res as any)
  const policyName = 'Content-Security-Policy'
  const policyText = `default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; base-uri 'none'; object-src 'none'; script-src 'nonce-${nonce}' 'strict-dynamic' https://mamtomo.com/test-url 'unsafe-inline' https:`


  // "default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; base-uri 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://mamtomo.com/test-url 'nonce-b771ce36-a563-4e69-b969-0a758ac0762e'"


  expect(mockSetHeader).toHaveBeenCalledTimes(1)
  // const calledWith = mockSetHeader
  expect(mockSetHeader).toHaveBeenCalledWith(policyName, policyText)
})
