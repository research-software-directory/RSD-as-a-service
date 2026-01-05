// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockSoftwareHighlights from './software_for_highlight.json'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'

export type SoftwareHighlight = SoftwareOverviewItemProps & {
  position: number | null
}

type getHighlightsApiParams = {
  page: number
  rows: number
  token?: string,
  searchFor?: string
  orderBy?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSoftwareHighlights=jest.fn(async({page, rows, token, searchFor, orderBy}: getHighlightsApiParams)=>{
  // console.log('getSoftwareHighlights...mocks DEFAULT')
  return {
    count: mockSoftwareHighlights.length,
    highlights: mockSoftwareHighlights
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addSoftwareHighlight=jest.fn(async({id, position, token}: {id: string, position: number, token: string})=>{
  // console.log('addSoftwareHighlight...mocks DEFAULT')
  return {
    status: 200,
    message: 'OK'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const patchSoftwareHighlights=jest.fn(async({highlights, token}: {highlights: SoftwareHighlight[], token: string})=>{
  // console.log('patchSoftwareHighlights...mocks DEFAULT')
  return {
    status: 200,
    message: 'OK'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteSoftwareHighlight=jest.fn(async({id, token}: {id: string, token: string})=>{
  // console.log('deleteSoftwareHighlight...mocks DEFAULT')

  return {
    status: 200,
    message: 'OK'
  }
})
