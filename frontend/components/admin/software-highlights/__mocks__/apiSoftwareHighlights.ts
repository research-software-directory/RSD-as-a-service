// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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

export async function getSoftwareHighlights({page, rows, token, searchFor, orderBy}: getHighlightsApiParams) {
  // console.log('getSoftwareHighlights...mocks DEFAULT')

  return {
    count: mockSoftwareHighlights.length,
    highlights: mockSoftwareHighlights
  }
}

export async function addSoftwareHighlight({id, position, token}: { id: string, position: number, token: string }) {
  // console.log('addSoftwareHighlight...mocks DEFAULT')

  return {
    status: 200,
    message: 'OK'
  }
}

export async function patchSoftwareHighlights({highlights, token}: { highlights: SoftwareHighlight[], token: string }) {
  // console.log('patchSoftwareHighlights...mocks DEFAULT')

  return {
    status: 200,
    message: 'OK'
  }
}

export async function deleteSoftwareHighlight({id, token}: { id: string, token: string }) {
  // console.log('deleteSoftwareHighlight...mocks DEFAULT')

  return {
    status: 200,
    message: 'OK'
  }
}
