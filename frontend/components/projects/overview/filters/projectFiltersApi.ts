// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'
import {StatusFilterOption} from './ProjectStatusFilter'

export type ResearchDomainInfo = {
  key: string,
  name: string,
}

export type DomainsFilterOption = {
  domain: string,
  domain_cnt: number
}

type ParicipatingOrganisationFilterOption = {
  organisation: string
  organisation_cnt: number
}

export type ProjectFilterProps = {
  search?: string | null
  project_status?: string | null
  keywords?: string[] | null
  domains?: string[] | null
  organisations?: string[] | null
  categories?: string[] | null
}

type ProjectFilterApiProps = {
  search_filter?: string
  status_filter?: string
  keyword_filter?: string[]
  research_domain_filter?: string[]
  organisation_filter?: string[]
  category_filter?: string[]
}

export function buildProjectFilter({
  search, keywords, domains, organisations, project_status, categories
}: ProjectFilterProps) {
  const filter: ProjectFilterApiProps = {}
  if (search) {
    filter['search_filter'] = search
  }
  if (keywords) {
    filter['keyword_filter'] = keywords
  }
  if (domains) {
    filter['research_domain_filter'] = domains
  }
  if (organisations) {
    filter['organisation_filter'] = organisations
  }
  if (project_status) {
    filter['status_filter'] = project_status
  }
  if (categories) {
    filter['category_filter'] = categories
  }
  // console.group('buildProjectFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}


export async function projectKeywordsFilter(params: ProjectFilterProps) {
  try {
    const query = 'rpc/project_keywords_filter?order=keyword'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter(params)

    // console.group('projectKeywordsFilter')
    // console.log('filter...', JSON.stringify(filter))
    // console.log('url...', url)
    // console.groupEnd()

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: filter ? JSON.stringify(filter) : undefined
    })

    if (resp.status === 200) {
      const json: KeywordFilterOption[] = await resp.json()
      return json
    }

    logger(`projectKeywordsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`projectKeywordsFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function projectDomainsFilter(params: ProjectFilterProps) {
  try {
    // get possible options
    const domainsOptions = await getDomainsFilterList(params)

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
    logger(`projectDomainsFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function getDomainsFilterList(params: ProjectFilterProps) {
  try {
    const query = 'rpc/project_domains_filter?order=domain'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter(params)

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

    logger(`getDomainsFilterList: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`getDomainsFilterList: ${e?.message}`, 'error')
    return []
  }
}

export async function getResearchDomainInfo(keys: string[]) {
  try {
    // ignore when keys not provided
    if (typeof keys === 'undefined' || keys === null) return []
    // GET research domains info by key
    const query = `key=in.("${keys.join('","')}")`
    const select = 'select=key,name'
    const url = `${getBaseUrl()}/research_domain?${select}&${query}`

    // console.log('url...', url)

    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: ResearchDomainInfo[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    logger(`getResearchDomainInfo: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getResearchDomainInfo: ${e?.message}`, 'error')
    return []
  }
}

export function createDomainsList(domainOptions: DomainsFilterOption[], domainInfo: ResearchDomainInfo[]) {
  const domainsList: ResearchDomainOption[] = []
  // return empty list
  if (domainOptions.length === 0 || domainInfo.length === 0) return domainsList
  //
  domainOptions.forEach(option => {
    const info = domainInfo.find(i => i.key === option.domain)
    if (info) {
      domainsList.push({
        key: option.domain,
        domain: `${option.domain}: ${info.name}`,
        domain_cnt: option.domain_cnt
      })
    }
  })
  return domainsList
}


export async function projectParticipatingOrganisationsFilter({search, keywords, domains, organisations, project_status}: ProjectFilterProps) {
  try {
    const query = 'rpc/project_participating_organisations_filter?order=organisation'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter({
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
      const json: ParicipatingOrganisationFilterOption[] = await resp.json()
      return json
    }

    logger(`projectParticipatingOrganisationsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`projectParticipatingOrganisationsFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function projectStatusFilter({search, keywords, domains, organisations}: ProjectFilterProps) {
  try {
    const query = 'rpc/project_status_filter?order=project_status'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter({
      search,
      keywords,
      domains,
      organisations
    })

    // console.group('projectStatusFilter')
    // console.log('filter...', JSON.stringify(filter))
    // console.log('url...', url)
    // console.groupEnd()

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: filter ? JSON.stringify(filter) : undefined
    })

    if (resp.status === 200) {
      const json: StatusFilterOption[] = await resp.json()
      return json
    }

    logger(`projectStatusFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`projectStatusFilter: ${e?.message}`, 'error')
    return []
  }
}
