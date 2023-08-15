// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import useOrganisationContext from '../../context/useOrganisationContext'
import useProjectParams from '../useProjectParams'
import {StatusFilterOption} from '~/components/projects/overview/filters/ProjectStatusFilter'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {buildOrgProjectFilter} from './useOrgProjectKeywordsList'
import logger from '~/utils/logger'

type OrgProjectStatusFilterProps = {
  id: string
  search?: string | null
  keywords?: string[] | null
  domains?: string[] | null
  organisations?: string[] | null
  token?:string
}


export async function orgProjectStatusFilter({
  id, search, keywords,
  domains, organisations, token
}: OrgProjectStatusFilterProps) {
  try {
    const query = 'rpc/org_project_status_filter?order=project_status'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgProjectFilter({
      id,
      search,
      keywords,
      domains,
      organisations

    })

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: StatusFilterOption[] = await resp.json()
      return json
    }

    logger(`orgProjectStatusFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgProjectStatusFilter: ${e?.message}`, 'error')
    return []
  }
}


export default function useOrgProjectStatusList() {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {search,keywords_json,domains_json,organisations_json} = useProjectParams()
  const [statusList, setStatusList] = useState<StatusFilterOption[]>([])

  // console.group('useOrgProjectStatusList')
  // console.log('id...', id)
  // console.log('search...', search)
  // console.log('keywords_json...', keywords_json)
  // console.log('domains_json...', domains_json)
  // console.log('organisations_json...', organisations_json)
  // console.log('statusList...', statusList)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (id) {
      const keywords = decodeJsonParam(keywords_json, null)
      const domains = decodeJsonParam(domains_json, null)
      const organisations = decodeJsonParam(organisations_json, null)

      // get filter options
      orgProjectStatusFilter({
        id,
        search,
        keywords,
        domains,
        organisations,
        token
      }).then(resp => {
        // abort
        if (abort) return
        setStatusList(resp)
      })
    }
    return () => {
      // debugger
      abort = true
    }
  }, [
    search, keywords_json,
    domains_json, organisations_json,
    id,token
  ])

  return {
    statusList
  }
}
