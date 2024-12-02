// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type SoftwareFilterProps = {
  search?: string | null
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
}

type GenericSoftwareFilterProps = SoftwareFilterProps & {
  rpc: string
}

type SoftwareFilterApiProps = {
  search_filter?: string
  keyword_filter?: string[]
  prog_lang_filter?: string[]
  license_filter?: string[]
}

export function buildSoftwareFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
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
  // console.group('buildSoftwareFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}

export async function softwareKeywordsFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'aggregated_software_keywords_filter'
  return genericSoftwareKeywordsFilter({search, keywords, prog_lang, licenses, rpc})
}

export async function highlightKeywordsFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'highlight_keywords_filter'
  return genericSoftwareKeywordsFilter({search, keywords, prog_lang, licenses, rpc})
}

export async function genericSoftwareKeywordsFilter({search, keywords, prog_lang, licenses, rpc}: GenericSoftwareFilterProps) {
  try {
    const query =`rpc/${rpc}?order=keyword`
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

    logger(`genericSoftwareKeywordsFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e:any) {
    logger(`genericSoftwareKeywordsFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}

export async function softwareLanguagesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'aggregated_software_languages_filter'
  return genericSoftwareLanguagesFilter({search, keywords, prog_lang, licenses, rpc})
}

export async function highlightLanguagesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'highlight_languages_filter'
  return genericSoftwareLanguagesFilter({search, keywords, prog_lang, licenses, rpc})
}

export async function genericSoftwareLanguagesFilter({search, keywords, prog_lang, licenses, rpc}: GenericSoftwareFilterProps) {
  try {
    const query = `rpc/${rpc}?order=prog_language`
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

    logger(`genericSoftwareLanguagesFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`genericSoftwareLanguagesFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}

export async function softwareLicensesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'aggregated_software_licenses_filter'
  return genericSoftwareLicensesFilter({search, keywords, prog_lang, licenses, rpc})
}


export async function highlightLicensesFilter({search, keywords, prog_lang, licenses}: SoftwareFilterProps) {
  const rpc = 'highlight_licenses_filter'
  return genericSoftwareLicensesFilter({search, keywords, prog_lang, licenses, rpc})
}

export async function genericSoftwareLicensesFilter({search, keywords, prog_lang, licenses, rpc}: GenericSoftwareFilterProps) {
  try {
    const query = `rpc/${rpc}?order=license`
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

    logger(`genericSoftwareLicensesFilter (${rpc}): ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`genericSoftwareLicensesFilter (${rpc}): ${e?.message}`, 'error')
    return []
  }
}
