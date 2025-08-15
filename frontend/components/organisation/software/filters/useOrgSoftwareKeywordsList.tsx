// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {buildSoftwareFilter} from '~/components/software/overview/filters/softwareFiltersApi'
import useOrganisationContext from '../../context/useOrganisationContext'
import useSoftwareParams from './useSoftwareParams'

export type OrgSoftwareFilterProps = {
  id: string
  search?: string | null
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
  categories?: string[] | null
  token?:string
}

export function buildOrgSoftwareFilter({id, ...params}: OrgSoftwareFilterProps) {
  const filter = {
    // additional organisation filter
    organisation_id: id,
    // add default software filter params
    ...buildSoftwareFilter(params)
  }
  // console.group('buildOrgProjectFilter')
  // console.log('filter...', filter)
  // console.groupEnd()
  return filter
}

export async function orgSoftwareKeywordsFilter({token,...params}: OrgSoftwareFilterProps) {
  try {
    const query = 'rpc/org_software_keywords_filter?order=keyword'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgSoftwareFilter(params)

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

    logger(`orgSoftwareKeywordsFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgSoftwareKeywordsFilter: ${e?.message}`, 'error')
    return []
  }
}


export default function useOrgSoftwareKeywordsList() {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {search,keywords_json,prog_lang_json,licenses_json,categories_json} = useSoftwareParams()
  const [keywordsList, setKeywordsList] = useState<KeywordFilterOption[]>([])

  // console.group('useOrgSoftwareKeywordsList')
  // console.log('id...', id)
  // console.log('search...', search)
  // console.log('keywords_json...', keywords_json)
  // console.log('prog_lang_json...', prog_lang_json)
  // console.log('licenses_json...', licenses_json)
  // console.log('keywordsList...', keywordsList)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (id) {
      const keywords = decodeJsonParam(keywords_json,null)
      const prog_lang = decodeJsonParam(prog_lang_json, null)
      const licenses = decodeJsonParam(licenses_json, null)
      const categories = decodeJsonParam(categories_json, null)

      // get filter options
      orgSoftwareKeywordsFilter({
        id,
        search,
        keywords,
        prog_lang,
        licenses,
        categories,
        token
      }).then(resp => {
        // abort
        if (abort) return
        setKeywordsList(resp)
      })
    }
    return () => {
      // debugger
      abort = true
    }
  }, [
    search, keywords_json,
    prog_lang_json, licenses_json,
    categories_json,
    id,token
  ])

  return {
    keywordsList
  }
}
