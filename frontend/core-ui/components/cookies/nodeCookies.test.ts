// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getMatomoConsent} from './nodeCookies'

const mockRequest:any = {
  headers: {
    cookie: '_pk_id.1.a7f1=7b08ec6de0eadf14.1664460134.; mtm_consent=1664460134155; _pk_ref.1.a7f1=%5B%22%22%2C%22%22%2C1670956090%2C%22https%3A%2F%2Fconnect.surfconext.nl%2F%22%5D; _pk_ses.1.a7f1=1'
  }
}

it('extracts mtm_consent cookie from request', () => {
  // extract matomo cookie
  const {matomoConsent} = getMatomoConsent(mockRequest)
  // assert consent is true
  expect(matomoConsent).toBe(true)
})


it('extracts mtm_consent_removed cookie from request', () => {
  mockRequest.headers.cookie ='mtm_consent_removed=1664460134155;'
  // extract matomo cookie
  const {matomoConsent} = getMatomoConsent(mockRequest)
  // expect consent is false
  expect(matomoConsent).toBe(false)
})


it('extracts mtm_consent is not present', () => {
  mockRequest.headers.cookie = '_pk_ses.1.a7f1=1;'
  // extract matomo cookie
  const {matomoConsent} = getMatomoConsent(mockRequest)
  // expect consent is false
  expect(matomoConsent).toBe(null)
})
