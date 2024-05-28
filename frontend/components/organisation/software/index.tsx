// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import UserAgreementModal from '~/components/user/settings/UserAgreementModal'
import useOrganisationContext from '../context/useOrganisationContext'
import {useUserSettings} from '../context/UserSettingsContext'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import {setDocumentCookie} from '~/utils/userSettings'
import FiltersPanel from '~/components/filter/FiltersPanel'
import OrgSoftwareFilters from './filters/index'
import useSoftwareParams from './filters/useSoftwareParams'
import useQueryChange from '../projects/useQueryChange'
import OrgSearchSoftwareSection from './search/OrgSearchSoftwareSection'
import useOrganisationSoftware from './useOrganisationSoftware'
import OrganisationSoftwareOverview from './OrganisationSoftwareOverview'

export default function OrganisationSoftware() {
  const smallScreen = useMediaQuery('(max-width:767px)')
  const {isMaintainer} = useOrganisationContext()
  const {handleQueryChange} = useQueryChange()
  const {page,rows} = useSoftwareParams()
  const {rsd_page_layout} = useUserSettings()
  // if masonry we change to grid
  const initView = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  const {software,count,loading} = useOrganisationSoftware()
  const [view, setView] = useState<ProjectLayoutType>(initView ?? 'grid')
  const numPages = Math.ceil(count / rows)

  // console.group('OrganisationSoftware')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('view...', view)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.groupEnd()

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
            <OrgSoftwareFilters />
          </FiltersPanel>
        }
        {/* Search & main content section */}
        <div className="flex-1">
          <OrgSearchSoftwareSection
            count={count}
            layout={view}
            setView={setLayout}
          />
          {/* software overview/content */}
          <OrganisationSoftwareOverview
            layout={view}
            software={software}
            loading={loading}
            rows={rows}
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
