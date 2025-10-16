// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {buildSoftwareFilter} from '~/components/software/overview/filters/softwareFiltersApi'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import {CommunityRequestStatus} from '../apiCommunitySoftware'

export type CommunitySoftwareFilterProps = {
  id: string
  software_status: CommunityRequestStatus
  search?: string | null
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
  categories?: string[] | null
  token?:string
}

function buildCommunitySoftwareFilter({id, software_status, ...params}: CommunitySoftwareFilterProps) {
  const filter = {
    // additional organisation filter
    community_id: id,
    software_status,
    // add default software filter params
    ...buildSoftwareFilter(params)
  }
  // console.group('buildCommunitySoftwareFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}

export async function comSoftwareKeywordsFilter({token,...params}: CommunitySoftwareFilterProps) {
  try {

    const query = 'rpc/com_software_keywords_filter?order=keyword'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildCommunitySoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: KeywordFilterOption[] = await resp.json()
      return json
    }

    logger(`comSoftwareKeywordsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`comSoftwareKeywordsFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function comSoftwareLanguagesFilter({token,...params}: CommunitySoftwareFilterProps) {
  try {
    const query = 'rpc/com_software_languages_filter?order=prog_language'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildCommunitySoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: LanguagesFilterOption[] = await resp.json()
      return json
    }

    logger(`comSoftwareLanguagesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`comSoftwareLanguagesFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function comSoftwareLicensesFilter({token,...params}: CommunitySoftwareFilterProps) {
  try {
    const query = 'rpc/com_software_licenses_filter?order=license'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildCommunitySoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: LicensesFilterOption[] = await resp.json()
      return json
    }

    logger(`comSoftwareLicensesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`comSoftwareLicensesFilter: ${e?.message}`, 'error')
    return []
  }
}

export async function comSoftwareCategoriesFilter({token,...params}: CommunitySoftwareFilterProps) {
  try {
    const query = 'rpc/com_software_categories_filter?order=category_cnt.desc,category'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildCommunitySoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: CategoryOption[] = await resp.json()
      return json
    }

    logger(`comSoftwareCategoriesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`comSoftwareCategoriesFilter: ${e?.message}`, 'error')
    return []
  }
}
