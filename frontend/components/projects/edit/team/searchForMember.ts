// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {findRSDPerson} from '~/utils/findRSDPerson'
import {getORCID} from '~/utils/getORCID'
import logger from '../../../../utils/logger'

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}

export type NewKeyword = {
  id: null,
  keyword: string
}

export async function searchForMember({searchFor,token,frontend=true}:
  {searchFor: string,token:string,frontend?:boolean}) {
  try {
    const [rsdContributor, orcidOptions] = await Promise.all([
      findRSDPerson({searchFor, token, frontend}),
      getORCID({searchFor})
    ])

    const options = [
      ...rsdContributor,
      ...orcidOptions
    ]

    return options

  } catch (e: any) {
    logger(`searchForMember: ${e?.message}`, 'error')
    return []
  }
}
