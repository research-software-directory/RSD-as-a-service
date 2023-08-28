// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'
import {
  DomainsFilterOption,
  createDomainsList, getResearchDomainInfo
} from '~/components/projects/overview/filters/projectFiltersApi'
import useOrganisationContext from '../../context/useOrganisationContext'
import useProjectParams from '../useProjectParams'
import {OrgProjectFilterProps, buildOrgProjectFilter} from './useOrgProjectKeywordsList'


export async function orgProjectDomainsList({id,search,project_status,keywords,domains,organisations}: OrgProjectFilterProps) {
  try {
    // get possible options
    const domainsOptions = await orgProjectDomainsFilter({
      id, search, project_status,
      keywords, domains, organisations
    })

    if (domainsOptions.length > 0) {
      const keys = domainsOptions.map(item => item.domain)
      // get research domain info (labels for keys)
      const domainsInfo = await getResearchDomainInfo(keys)
      // combine keys, names and counts
      const domainsList = createDomainsList(
        domainsOptions,
        domainsInfo
      )
      return domainsList
    }

    return []
  } catch (e: any) {
    logger(`orgProjectDomainsList: ${e?.message}`, 'error')
    return []
  }
}

async function orgProjectDomainsFilter({id,search,project_status,keywords,domains,organisations}: OrgProjectFilterProps) {
  try {
    const query = 'rpc/org_project_domains_filter?order=domain'
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
      headers: createJsonHeaders(),
      body: filter ? JSON.stringify(filter) : undefined
    })

    if (resp.status === 200) {
      const json: DomainsFilterOption[] = await resp.json()
      return json
    }

    logger(`orgProjectDomainsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgProjectDomainsFilter: ${e?.message}`, 'error')
    return []
  }
}

export default function useOrgProjectDomainsFilter(){
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {search,project_status,keywords_json,domains_json,organisations_json} = useProjectParams()
  const [domainsList, setDomainsList] = useState<ResearchDomainOption[]>([])

  // console.group('useOrgProjectDomainsFilter')
  // console.log('id...', id)
  // console.log('search...', search)
  // console.log('keywords_json...', keywords_json)
  // console.log('domains_json...', domains_json)
  // console.log('organisations_json...', organisations_json)
  // console.log('domainsList...', domainsList)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (id) {
      const keywords = decodeJsonParam(keywords_json,null)
      const domains = decodeJsonParam(domains_json, null)
      const organisations = decodeJsonParam(organisations_json, null)

      // get filter options
      orgProjectDomainsList({
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
        setDomainsList(resp)
      })
    }
    return () => {
      // debugger
      abort = true
    }
  }, [
    search, keywords_json,
    domains_json, organisations_json,
    id,token, project_status
  ])

  return {
    domainsList
  }

}
