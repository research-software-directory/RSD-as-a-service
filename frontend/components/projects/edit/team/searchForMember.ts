// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {SearchTeamMember} from '~/types/Project'
import {createJsonHeaders} from '~/utils/fetchHelpers'
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
      findRSDMember({searchFor, token, frontend}),
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


// this is always frontend call
export async function findRSDMember({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {
    let url = `${process.env.POSTGREST_URL}/rpc/unique_team_members?display_name=ilike.*${searchFor}*&limit=20`
    if (frontend) {
      url = `/api/v1/rpc/unique_team_members?display_name=ilike.*${searchFor}*&limit=20`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: SearchTeamMember[] = await resp.json()
      const options: AutocompleteOption<SearchTeamMember>[] = data.map(item => {
        return {
          key: item.display_name ?? '',
          label: item.display_name ?? '',
          data: {
            ...item,
            source: 'RSD'
          }
        }
      })
      return options
    } else if (resp.status === 404) {
      logger('findRSDMember ERROR: 404 Not found', 'error')
      // query not found
      return []
    }
    logger(`findRSDMember ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []
  } catch (e: any) {
    logger(`findRSDMember: ${e?.message}`, 'error')
    return []
  }
}
