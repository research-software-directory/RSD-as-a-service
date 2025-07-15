// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import useOrganisationContext from '../../context/useOrganisationContext'
import useSoftwareParams from './useSoftwareParams'
import {OrgSoftwareFilterProps, buildOrgSoftwareFilter} from './useOrgSoftwareKeywordsList'

export async function orgSoftwareLicensesFilter({token,...params}: OrgSoftwareFilterProps) {
  try {
    const query = 'rpc/org_software_licenses_filter?order=license'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgSoftwareFilter(params)

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

    logger(`orgSoftwareLicensesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgSoftwareLicensesFilter: ${e?.message}`, 'error')
    return []
  }
}


export default function useOrgSoftwareLicensesList() {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {search,keywords_json,prog_lang_json,licenses_json,categories_json} = useSoftwareParams()
  const [licensesList, setLicensesList] = useState<LicensesFilterOption[]>([])

  // console.group('useOrgSoftwareLicensesList')
  // console.log('id...', id)
  // console.log('search...', search)
  // console.log('keywords_json...', keywords_json)
  // console.log('prog_lang_json...', prog_lang_json)
  // console.log('licenses_json...', licenses_json)
  // console.log('licensesList...', licensesList)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (id) {
      const keywords = decodeJsonParam(keywords_json, null)
      const prog_lang = decodeJsonParam(prog_lang_json, null)
      const licenses = decodeJsonParam(licenses_json, null)
      const categories = decodeJsonParam(categories_json, null)

      // get filter options
      orgSoftwareLicensesFilter({
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
        setLicensesList(resp)
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
    licensesList
  }
}
