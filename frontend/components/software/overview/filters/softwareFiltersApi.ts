// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type SoftwareFilterProps = {
  search?: string
  keywords?: string[]
  prog_lang?: string[]
  licenses?: string[]
}

type SoftwareFilterApiProps = {
  search_filter?: string
  keyword_filter?: string[]
  prog_lang_filter?: string[]
  license_filter?: string[]
}

export type KeywordFilterOption = {
  keyword: string
  keyword_cnt: number
}


function buildSoftwareFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const filter: SoftwareFilterApiProps={}
  if (search) {
    filter['search_filter']=search
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
  // console.group('buildSoftwareFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}


export async function softwareKeywordsFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  try {
    const query ='rpc/software_keywords_filter?order=keyword'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter({
      search,
      keywords,
      prog_lang,
      licenses
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
      const json: KeywordFilterOption[] = await resp.json()
      return json
    }

    logger(`softwareKeywordsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e:any) {
    logger(`softwareKeywordsFilter: ${e?.message}`, 'error')
    return []
  }
}

export type LanguagesFilterOption = {
  prog_language: string
  prog_language_cnt: number
}

export async function softwareLanguagesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  try {
    const query = 'rpc/software_languages_filter?order=prog_language'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter({
      search,
      keywords,
      prog_lang,
      licenses
    })

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

    logger(`softwareLanguagesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`softwareLanguagesFilter: ${e?.message}`, 'error')
    return []
  }
}


export type LicensesFilterOption = {
  license: string
  license_cnt: number
}

export async function softwareLicesesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  try {
    const query = 'rpc/software_licenses_filter?order=license'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildSoftwareFilter({
      search,
      keywords,
      prog_lang,
      licenses
    })

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: LicensesFilterOption[] = await resp.json()
      return json
    }

    logger(`softwareLicesesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`softwareLicesesFilter: ${e?.message}`, 'error')
    return []
  }
}
