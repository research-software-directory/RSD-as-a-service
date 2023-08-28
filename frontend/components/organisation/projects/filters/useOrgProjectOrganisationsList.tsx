// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {OrganisationOption} from '~/components/filter/OrganisationsFilter'
import useOrganisationContext from '../../context/useOrganisationContext'
import useProjectParams from '../useProjectParams'
import {OrgProjectFilterProps, buildOrgProjectFilter} from './useOrgProjectKeywordsList'

export async function orgProjectOrganisationsFilter({
  id,search,project_status,keywords,domains,organisations,token
}: OrgProjectFilterProps) {
  try {
    const query = 'rpc/org_project_participating_organisations_filter?order=organisation'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgProjectFilter({
      id,
      search,
      keywords,
      domains,
      organisations,
      project_status
    })

    // console.group('softwareKeywordsFilter')
    // console.log('filter...', JSON.stringify(filter))
    // console.log('url...', url)
    // console.groupEnd()

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: filter ? JSON.stringify(filter) : undefined
    })

    if (resp.status === 200) {
      const json: OrganisationOption[] = await resp.json()
      return json
    }

    logger(`orgProjectOrganisationsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgProjectOrganisationsFilter: ${e?.message}`, 'error')
    return []
  }
}


export default function useOrgProjectOrganisationList() {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {search,project_status,keywords_json,domains_json,organisations_json} = useProjectParams()
  const [organisationList, setOrganisationList] = useState<OrganisationOption[]>([])

  // console.group('useOrgProjectOrganisationList')
  // console.log('id...', id)
  // console.log('search...', search)
  // console.log('keywords_json...', keywords_json)
  // console.log('domains_json...', domains_json)
  // console.log('organisations_json...', organisations_json)
  // console.log('organisationList...', organisationList)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (id) {
      const keywords = decodeJsonParam(keywords_json,null)
      const domains = decodeJsonParam(domains_json, null)
      const organisations = decodeJsonParam(organisations_json, null)

      // get filter options
      orgProjectOrganisationsFilter({
        id,
        search,
        keywords,
        domains,
        organisations,
        project_status,
        token
      }).then(resp => {
        // abort
        if (abort) return
        setOrganisationList(resp)
      })
    }
    return () => {
      // debugger
      abort = true
    }
  }, [
    search, keywords_json,
    domains_json, organisations_json,
    id,token,project_status
  ])

  return {
    organisationList
  }
}
