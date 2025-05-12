// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import FiltersPanel from '~/components/filter/FiltersPanel'
import useOrganisationContext from '../context/useOrganisationContext'
import useQueryChange from '../projects/useQueryChange'
import OrgSoftwareFilters from './filters/index'
import useSoftwareParams from './filters/useSoftwareParams'
import OrgSearchSoftwareSection from './search/OrgSearchSoftwareSection'
import useOrganisationSoftware from './useOrganisationSoftware'
import OrganisationSoftwareOverview from './OrganisationSoftwareOverview'

export default function OrganisationSoftware() {
  const smallScreen = useMediaQuery('(max-width:767px)')
  const {isMaintainer} = useOrganisationContext()
  const {handleQueryChange} = useQueryChange()
  const {page,rows,view,setPageLayout} = useSoftwareParams()
  const {software,count,loading} = useOrganisationSoftware()
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

  return (
    <>
      {/* Only when maintainer */}
      {isMaintainer && <UserAgreementModal />}
      {/* Page grid with 2 sections: left filter panel and main content */}
      <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
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
            setView={setPageLayout}
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
