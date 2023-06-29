// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import OrgOrderSoftwareBy from './OrgOrderSoftwareBy'
import OrgProjectKeywordsFilter from './OrgSoftwareKeywordsFilter'
import useSoftwareParams from './useSoftwareParams'
import useOrgSoftwareKeywordsList from './useOrgSoftwareKeywordsList'
import OrgSoftwareLicensesFilter from './OrgSoftwareLicensesFilter'
import useOrgSoftwareLicensesList from './useOrgSoftwareLicensesList'
import OrgSoftwareLanguagesFilter from './OrgSoftwareLanguagesFilter'
import useOrgSoftwareLanguagesList from './useOrgSoftwareLanguagesList'

export default function OrgSoftwareFilters() {
  const {resetFilters} = useQueryChange()
  const {order,filterCnt,keywords_json,prog_lang_json,licenses_json} = useSoftwareParams()
  const {keywordsList} = useOrgSoftwareKeywordsList()
  const {languagesList} = useOrgSoftwareLanguagesList()
  const {licensesList} = useOrgSoftwareLicensesList()

  const keywords = decodeJsonParam(keywords_json, [])
  const prog_lang = decodeJsonParam(prog_lang_json, [])
  const licenses= decodeJsonParam(licenses_json,[])

  // debugger
  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    if (order) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        disableClear={clearDisabled()}
        resetFilters={()=>resetFilters('software')}
      />
      {/* Order by */}
      <OrgOrderSoftwareBy />
      {/* Keywords */}
      <OrgProjectKeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
      />
      {/* Program languages */}
      <OrgSoftwareLanguagesFilter
        prog_lang={prog_lang}
        languagesList={languagesList}
      />
      {/* Licenses */}
      <OrgSoftwareLicensesFilter
        licenses={licenses}
        licensesList={licensesList}
      />
    </>
  )
}
