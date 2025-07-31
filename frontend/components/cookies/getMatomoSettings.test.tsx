// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getMatomoSettings} from '~/components/cookies/getMatomoSettings'

const mockCookieGet = jest.fn()

jest.mock('next/headers',()=>({
  cookies: ()=>new Promise((res)=>{
    res({
      get: mockCookieGet
    })
  })
}))

beforeEach(()=>{
  jest.clearAllMocks()
})

it('returns matomo id and url when provided', async()=>{
  const matomo_id = '123'
  const matomo_url= 'https://test.com'

  process.env.MATOMO_ID = matomo_id
  process.env.MATOMO_URL = matomo_url

  const matomo = await getMatomoSettings()

  expect(matomo.id).toBe(matomo_id)
  expect(matomo.id).toBe(matomo_id)
})

it('returns matomo id and url as NULL when empty string', async()=>{
  const matomo_id = ''
  const matomo_url= ''

  process.env.MATOMO_ID = matomo_id
  process.env.MATOMO_URL = matomo_url

  const matomo = await getMatomoSettings()

  expect(matomo.id).toBe(null)
  expect(matomo.id).toBe(null)
})

it('returns matomo consent true when cookie mtm_consent is present', async()=>{
  const matomo_id = '123'
  const matomo_url= 'https://test.com'
  process.env.MATOMO_ID = matomo_id
  process.env.MATOMO_URL = matomo_url

  mockCookieGet.mockReturnValue({
    mtm_consent:{name:'test-name',value:'test-value'}
  })

  const matomo = await getMatomoSettings()
  expect(matomo.consent).toBe(true)

})

it('returns matomo consent false when cookie mtm_consent_removed is present', async()=>{
  const matomo_id = '123'
  const matomo_url= 'https://test.com'
  process.env.MATOMO_ID = matomo_id
  process.env.MATOMO_URL = matomo_url

  // mock first undefined for mtm_consent cookie
  mockCookieGet.mockReturnValueOnce(undefined)
  // mock then response for mtm_consent_removed
  mockCookieGet.mockReturnValue({
    mtm_consent_removed:{name:'test-name',value:'test-value'}
  })

  const matomo = await getMatomoSettings()
  expect(matomo.consent).toBe(false)

})

it('returns consent===null when cookies are NOT present', async()=>{
  const matomo_id = '123'
  const matomo_url= 'https://test.com'
  process.env.MATOMO_ID = matomo_id
  process.env.MATOMO_URL = matomo_url

  mockCookieGet.mockReturnValue(undefined)

  const matomo = await getMatomoSettings()
  expect(matomo.consent).toBe(null)

})
