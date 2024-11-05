// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Pagination from '@mui/material/Pagination'

import {setDocumentCookie} from '~/utils/userSettings'
import UserAgreementModal from '~/components/user/settings/UserAgreementModal'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {useCommunityContext} from '~/components/communities/context'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'

import CommunitySoftwareFilters from './filters'
import SearchCommunitySoftwareSection from './search'
import CommunitySoftwareOverview from './CommunitySoftwareOverview'
import {SoftwareOfCommunity} from './apiCommunitySoftware'

type CommunitySoftwareProps={
  software: SoftwareOfCommunity[]
  count: number
  rows: number
  page: number
  rsd_page_layout: LayoutType
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
}

export default function CommunitySoftware({
  software,count,page,rows,rsd_page_layout,
  keywordsList, languagesList, licensesList
}:CommunitySoftwareProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {isMaintainer} = useCommunityContext()
  const {handleQueryChange} = useFilterQueryChange()
  // if masonry we change to grid
  const initView = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  const [view, setView] = useState<ProjectLayoutType>(initView ?? 'grid')
  const numPages = Math.ceil(count / rows)

  function setLayout(view: ProjectLayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
  }

  return (
    <>
      {/* Only when maintainer */}
      {isMaintainer && <UserAgreementModal />}
      {/* Page grid with 2 sections: left filter panel and main content */}
      <div className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-4 mb-12">
        {/* Filters panel large screen */}
        {smallScreen === false &&
          <FiltersPanel>
            <CommunitySoftwareFilters
              keywordsList={keywordsList}
              languagesList={languagesList}
              licensesList={licensesList}
            />
          </FiltersPanel>
        }
        <div className="flex-1">
          {/* Search & mobile filter modal */}
          <SearchCommunitySoftwareSection
            count={count}
            layout={view}
            setView={setLayout}
            keywordsList={keywordsList}
            languagesList={languagesList}
            licensesList={licensesList}
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
