// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {SoftwareOfCommunity} from './apiCommunitySoftware'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import FiltersPanel from '~/components/filter/FiltersPanel'
import CommunitySoftwareFilters from './filters'
import SearchCommunitySoftwareSection from './search'
import CommunitySoftwareOverview from './CommunitySoftwareOverview'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'

type CommunitySoftwareProps={
  software: SoftwareOfCommunity[]
  count: number
  page: number
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
  categoryList: CategoryOption[]
  pages: number
  isMaintainer: boolean
}

export default function CommunitySoftware({
  software,count,page,pages,
  keywordsList,languagesList,licensesList,
  categoryList,isMaintainer
}:CommunitySoftwareProps) {

  return (
      <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
        <FiltersPanel>
          <CommunitySoftwareFilters
            keywordsList={keywordsList}
            languagesList={languagesList}
            licensesList={licensesList}
            categoryList={categoryList}
          />
        </FiltersPanel>
        <div className="flex-1">
          {/* Search & mobile filter modal */}
          <SearchCommunitySoftwareSection
            count={count}
            keywordsList={keywordsList}
            languagesList={languagesList}
            licensesList={licensesList}
            categoryList={categoryList}
          />
          {/* software overview/content */}
          <CommunitySoftwareOverview
            software={software}
            isMaintainer={isMaintainer}
          />
          {/* Pagination */}
          <PaginationLinkApp
            count={pages}
            page={page ?? 1}
            className='mt-4'
          />
        </div>
      </div>
    )
}
