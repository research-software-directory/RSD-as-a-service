// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {HostsFilterOption} from '~/components/filter/RsdHostFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'

type SoftwareFilterProps = {
  search?: string | null
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
  categories?: string[] | null
  rsd_host?: string | null
}

type GenericSoftwareFilterProps = SoftwareFilterProps & {
  rpc: string
}

type SoftwareFilterApiProps = {
  search_filter?: string
  keyword_filter?: string[]
  prog_lang_filter?: string[]
  license_filter?: string[]
  category_filter?: string[]
  rsd_host_filter?: string | null
}

export function buildSoftwareFilter({
  search, keywords, prog_lang, licenses, categories, rsd_host
}: SoftwareFilterProps) {
  const filter: SoftwareFilterApiProps={}
  if (search) {
    filter['search_filter'] = search
  }
  if (keywords) {
    filter['keyword_filter'] = keywords
  }
  if (prog_lang) {
    filter['prog_lang_filter'] = prog_lang
  }
  if (licenses) {
    filter['license_filter'] = licenses
  }
  if (categories) {
    filter['category_filter'] = categories
  }
  if (rsd_host) {
    if (rsd_host==='null') {
      filter['rsd_host_filter'] = null
    }else{
      filter['rsd_host_filter'] = rsd_host
    }
  }
  // console.group('buildSoftwareFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}

export async function softwareKeywordsFilter(params: SoftwareFilterProps) {
  const rpc = 'aggregated_software_keywords_filter'
  return genericSoftwareKeywordsFilter({...params,rpc})
}

export async function highlightKeywordsFilter(params: SoftwareFilterProps) {
  const rpc = 'highlight_keywords_filter'
  return genericSoftwareKeywordsFilter({...params, rpc})
}

export async function genericSoftwareKeywordsFilter({rpc, ...params}: GenericSoftwareFilterProps) {
  try {
    const query =`rpc/${rpc}?order=keyword`
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter(params)

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
      const json: KeywordFilterOption[] = await resp.json()
      return json
    }

    logger(`genericSoftwareKeywordsFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e:any) {
    logger(`genericSoftwareKeywordsFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}

export async function softwareLanguagesFilter(params: SoftwareFilterProps) {
  const rpc = 'aggregated_software_languages_filter'
  return genericSoftwareLanguagesFilter({...params, rpc})
}

export async function highlightLanguagesFilter(params: SoftwareFilterProps) {
  const rpc = 'highlight_languages_filter'
  return genericSoftwareLanguagesFilter({...params, rpc})
}

export async function genericSoftwareLanguagesFilter({rpc,...params}: GenericSoftwareFilterProps) {
  try {
    const query = `rpc/${rpc}?order=prog_language`
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter(params)

    // console.group('softwareLanguagesFilter')
    // console.log('filter...', JSON.stringify(filter))
    // console.log('url...', url)
    // console.groupEnd()

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: LanguagesFilterOption[] = await resp.json()
      return json
    }

    logger(`genericSoftwareLanguagesFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`genericSoftwareLanguagesFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}

export async function softwareLicensesFilter(props: SoftwareFilterProps) {
  const rpc = 'aggregated_software_licenses_filter'
  return genericSoftwareLicensesFilter({...props, rpc})
}


export async function highlightLicensesFilter(props: SoftwareFilterProps) {
  const rpc = 'highlight_licenses_filter'
  return genericSoftwareLicensesFilter({...props, rpc})
}

export async function genericSoftwareLicensesFilter({rpc,...params}: GenericSoftwareFilterProps) {
  try {
    const query = `rpc/${rpc}?order=license`
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: LicensesFilterOption[] = await resp.json()
      return json
    }

    logger(`genericSoftwareLicensesFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`genericSoftwareLicensesFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}

export async function softwareCategoriesFilter(props: SoftwareFilterProps,rpcName:string='aggregated_software_categories_filter') {
  try {
    const query = `/rpc/${rpcName}?order=category_cnt.desc,category`
    const url = `${getBaseUrl()}${query}`
    const filter = buildSoftwareFilter(props)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: CategoryOption[] = await resp.json()
      return json
    }

    logger(`softwareCategoriesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`softwareCategoriesFilter: ${e?.message}`, 'error')
    return []
  }
}


export async function softwareRsdHostsFilter(props: SoftwareFilterProps) {
  try {
    const query = 'aggregated_software_hosts_filter?order=rsd_host'
    const url = `${getBaseUrl()}/rpc/${query}`
    const filter = buildSoftwareFilter(props)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: HostsFilterOption[] = await resp.json()
      return json
    }

    logger(`softwareRsdHostsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`softwareRsdHostsFilter: ${e?.message}`, 'error')
    return []
  }
}
