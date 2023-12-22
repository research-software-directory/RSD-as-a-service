// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'


import mockSoftwareByMaintainer from './softwareByMaintainer.json'

type UserSoftwareProp = {
  searchFor?: string
  page: number,
  rows: number,
  session: Session
}

export default function useUserSoftware({searchFor, page, rows, session}:UserSoftwareProp) {

  return {
    software:mockSoftwareByMaintainer,
    count:mockSoftwareByMaintainer.length,
    loading:false
  }
}
