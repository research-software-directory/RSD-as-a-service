// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {CategoryEntry} from '~/types/Category'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import FilterHeader from '~/components/filter/FilterHeader'
import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import LicensesFilter, {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import ProgrammingLanguagesFilter, {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import CategoriesFilter, {CategoryOption} from '~/components/filter/CategoriesFilter'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import useCategoryFilterCnt from '~/components/category/useCategoryFilterCnt'
import OrderCommunitySoftwareBy from './OrderCommunitySoftwareBy'
import useResetFilters from './useResetFilters'
import useComSoftwareCategoriesList from './useComSoftwareCategoriesList'

type CommunitySoftwareFiltersProps = {
  keywordsList: KeywordFilterOption[]
  languagesList: LanguagesFilterOption[]
  licensesList: LicensesFilterOption[]
  categoryList: CategoryOption[]
  categoryEntry: CategoryEntry[]
}

export default function CommunitySoftwareFilters({
  keywordsList,languagesList,licensesList,categoryList,categoryEntry
}:CommunitySoftwareFiltersProps) {
  const {handleQueryChange} = useHandleQueryChange()
  const {resetFilters} = useResetFilters()
  const {categoryFilters} = useComSoftwareCategoriesList({categoryList,categoryEntry})
  // extract query params
  const {
    filterCnt,keywords_json,prog_lang_json,
    licenses_json, categories_json
  } = useSoftwareParams()
  // include separate categories filters to total filter count
  const {activeCnt:totFilterCnt} = useCategoryFilterCnt({
    categoryFilters,
    categories_json,
    // provide base count without categories_json
    baseCnt: categories_json ? filterCnt - 1 : filterCnt
  })

  // decode query params
  const keywords = decodeJsonParam(keywords_json, [])
  const prog_lang = decodeJsonParam(prog_lang_json, [])
  const licenses= decodeJsonParam(licenses_json,[])
  const categories= decodeJsonParam(categories_json,[])

  // console.group('CommunitySoftwareFilters')
  // console.log('filterCnt...', filterCnt)
  // console.log('totFilterCnt...', totFilterCnt)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('categoryList...', categoryList)
  // console.log('categoryEntry...', categoryEntry)
  // console.log('categoryFilters...', categoryFilters)
  // console.groupEnd()

  // debugger
  function clearDisabled() {
    if (totFilterCnt && totFilterCnt > 0) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={totFilterCnt}
        disableClear={clearDisabled()}
        resetFilters={()=>resetFilters('software')}
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
      {/* Custom community categories */}
      {categoryFilters.map(filter=>
        <div key={filter?.short_name}>
          <CategoriesFilter
            title={filter.short_name}
            categories={categories}
            categoryList={filter.options}
            handleQueryChange={handleQueryChange}
          />
        </div>
      )}
    </>
  )
}
