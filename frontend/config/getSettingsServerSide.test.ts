// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {getSettingsServerSide} from './getSettingsServerSide'

import defaultSettings from '~/config/defaultSettings.json'

const mockReq:any = jest.fn()

it('returns settings SSR', async () => {
  // resolve getPageLinks
  mockResolvedValueOnce([])
  // resolve getRsdSettings
  mockResolvedValueOnce(defaultSettings)

  const resp = await getSettingsServerSide(mockReq, {})

  expect(resp).toEqual({
    ...defaultSettings,
    pages: []
  })
})
