// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import Pagination from '@mui/material/Pagination'

import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {useCommunityContext} from '~/components/communities/context'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'

import CommunitySoftwareFilters from './filters'
import SearchCommunitySoftwareSection from './search'
import CommunitySoftwareOverview from './CommunitySoftwareOverview'
import {SoftwareOfCommunity} from './apiCommunitySoftware'

type CommunitySoftwareProps={
  software: SoftwareOfCommunity[]
  count: number
  page: number
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
  categoryList: CategoryOption[]
}

export default function CommunitySoftware({
  software,count,page,
  keywordsList,languagesList,licensesList,
  categoryList
}:CommunitySoftwareProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {isMaintainer} = useCommunityContext()
  const {handleQueryChange} = useFilterQueryChange()
  const {rows,view,setPageLayout} = useSoftwareParams()
  const numPages = Math.ceil(count / rows)

  // console.group('CommunitySoftware')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('view...', view)
  // console.log('rows...', rows)
  // console.groupEnd()

  return (
    <>
      {/* Only when maintainer */}
      {isMaintainer && <UserAgreementModal />}
      {/* Page grid with 2 sections: left filter panel and main content */}
      <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
        {/* Filters panel large screen */}
        {smallScreen === false &&
          <FiltersPanel>
            <CommunitySoftwareFilters
              keywordsList={keywordsList}
              languagesList={languagesList}
              licensesList={licensesList}
              categoryList={categoryList}
            />
          </FiltersPanel>
        }
        <div className="flex-1">
          {/* Search & mobile filter modal */}
          <SearchCommunitySoftwareSection
            count={count}
            layout={view}
            setView={setPageLayout}
            keywordsList={keywordsList}
            languagesList={languagesList}
            licensesList={licensesList}
            categoryList={categoryList}
            smallScreen={smallScreen}
          />
          {/* software overview/content */}
          <CommunitySoftwareOverview
            layout={view}
            software={software}
          />
          {/* Pagination */}
          {numPages > 1 &&
            <div className="flex flex-wrap justify-center mt-8">
              <Pagination
                count={numPages}
                page={page}
                onChange={(_, page) => {
                  handleQueryChange('page',page.toString())
                }}
              />
            </div>
          }
        </div>
      </div>
    </>
  )
}
