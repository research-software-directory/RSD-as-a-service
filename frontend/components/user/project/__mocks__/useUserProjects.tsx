// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'
import mockProjectsByMaintainer from './projectsByMaintainer.json'

export type UserProjectsProp = {
  searchFor?: string
  page: number,
  rows: number,
  session: Session
}

export default function useUserProjects({searchFor, page, rows, session}: UserProjectsProp) {

  return {
    projects: mockProjectsByMaintainer,
    count: mockProjectsByMaintainer.length,
    loading: false
  }
}
