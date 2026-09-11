// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {getCspPolicy} from './contentSecurityPolicy'

beforeEach(() => {
  jest.clearAllMocks()
})

it('content security policy header for development', () => {
  // @ts-expect-error workaround to get security upgrades (Next.js 16.3.4) working
  process.env.NODE_ENV = 'development'

  const nonce = 'abc'
  const policy = getCspPolicy(nonce)

  const policyText = `default-src 'self'; connect-src 'self' https://*; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; base-uri 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}' 'unsafe-eval';`
  expect(policy).toEqual(policyText)

})

it('content security policy header for production', () => {
  // @ts-expect-error workaround to get security upgrades (Next.js 16.3.4) working
  process.env.NODE_ENV = 'production'

  const nonce = 'abc'
  const policy = getCspPolicy(nonce)

  const policyText = `default-src 'self'; connect-src 'self' https://*; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; base-uri 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}' ;`
  expect(policy).toEqual(policyText)

})
