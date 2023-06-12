// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
  const policyText = `default-src \'self\'; style-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://*; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https://*; script-src \'self\'  \'unsafe-eval\' \'nonce-${nonce}'`


  expect(mockSetHeader).toBeCalledTimes(1)
  // const calledWith = mockSetHeader
  expect(mockSetHeader).toBeCalledWith(policyName,policyText)
})

it('sets content security policy header for production', () => {
  process.env.NODE_ENV = 'production'
  process.env.MATOMO_URL = 'https://mamtomo.com/test-url'
  const nonce = setContentSecurityPolicyHeader(res as any)
  const policyName = 'Content-Security-Policy'
  const policyText = `default-src \'self\'; style-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://*; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https://*; script-src \'self\' https://mamtomo.com/test-url  \'nonce-${nonce}'`


  expect(mockSetHeader).toBeCalledTimes(1)
  // const calledWith = mockSetHeader
  expect(mockSetHeader).toBeCalledWith(policyName, policyText)
})
