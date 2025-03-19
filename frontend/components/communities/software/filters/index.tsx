// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import FilterHeader from '~/components/filter/FilterHeader'
import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import LicensesFilter, {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import ProgrammingLanguagesFilter, {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import CategoriesFilter, {CategoryOption} from '~/components/filter/CategoriesFilter'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'

import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import OrderCommunitySoftwareBy from './OrderCommunitySoftwareBy'
import useCommunityHasCategories from './useCommunityHasCategories'


type CommunitySoftwareFiltersProps = {
  keywordsList: KeywordFilterOption[]
  languagesList: LanguagesFilterOption[]
  licensesList: LicensesFilterOption[]
  categoryList: CategoryOption[]
}

export default function CommunitySoftwareFilters({
  keywordsList,languagesList,licensesList,categoryList
}:CommunitySoftwareFiltersProps) {
  const router = useRouter()
  const hasCategories = useCommunityHasCategories()
  const {handleQueryChange} = useFilterQueryChange()
  // extract query params
  const {
    filterCnt,keywords_json,prog_lang_json,
    licenses_json,categories_json
  } = useSoftwareParams()
  // decode query params
  const keywords = decodeJsonParam(keywords_json, [])
  const prog_lang = decodeJsonParam(prog_lang_json, [])
  const licenses= decodeJsonParam(licenses_json,[])
  const categories= decodeJsonParam(categories_json,[])

  // console.group('CommunitySoftwareFilters')
  // console.log('hasCategories...', hasCategories)
  // console.log('categoryList...', categoryList)
  // console.groupEnd()

  // debugger
  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    return true
  }

  function resetFilters(){
    // use basic params
    const query: any = {
      slug: router.query.slug,
      // keep order if provided
      order: router.query?.order ? router.query?.order : 'mention_cnt'
    }
    router.push({query},undefined,{scroll: false})
  }

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        disableClear={clearDisabled()}
        resetFilters={resetFilters}
      />
      {/* Order by */}
      <OrderCommunitySoftwareBy />
      {/* Keywords */}
      <div>
        <KeywordsFilter
          keywords={keywords}
          keywordsList={keywordsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Program languages */}
      <div>
        <ProgrammingLanguagesFilter
          prog_lang={prog_lang}
          languagesList={languagesList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Licenses */}
      <div>
        <LicensesFilter
          licenses={licenses}
          licensesList={licensesList}
          handleQueryChange={handleQueryChange}
        />
      </div>

      {hasCategories ?
        <div>
          <CategoriesFilter
            title="Categories"
            categories={categories}
            categoryList={categoryList}
            handleQueryChange={handleQueryChange}
          />
        </div>
        :null
      }
    </>
  )
}
