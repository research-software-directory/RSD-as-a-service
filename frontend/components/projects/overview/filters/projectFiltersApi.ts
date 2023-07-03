// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'

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
  organisation_cnt: string
}

export type ProjectFilterProps = {
  search?: string | null
  keywords?: string[] | null
  domains?: string[] | null
  organisations?: string[] | null
}

type ProjectFilterApiProps = {
  search_filter?: string
  keyword_filter?: string[]
  research_domain_filter?: string[]
  organisation_filter?: string[]
}

export function buildProjectFilter({search, keywords, domains, organisations}: ProjectFilterProps) {
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
  // console.group('buildProjectFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}


export async function projectKeywordsFilter({search, keywords, domains, organisations}: ProjectFilterProps) {
  try {
    const query = 'rpc/project_keywords_filter?order=keyword'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter({
      search,
      keywords,
      domains,
      organisations
    })

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

export async function projectDomainsFilter({search, keywords, domains, organisations}: ProjectFilterProps) {
  try {
    // get possible options
    const domainsOptions = await getDomainsFilterList({search, keywords, domains, organisations})

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

export async function getDomainsFilterList({search, keywords, domains, organisations}: ProjectFilterProps) {
  try {
    const query = 'rpc/project_domains_filter?order=domain'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter({
      search,
      keywords,
      domains,
      organisations
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
  let domainsList: ResearchDomainOption[] = []
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


export async function projectParticipatingOrganisationsFilter({search, keywords, domains, organisations}: ProjectFilterProps) {
  try {
    const query = 'rpc/project_participating_organisations_filter?order=organisation'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildProjectFilter({
      search,
      keywords,
      domains,
      organisations
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
