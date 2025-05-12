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
import OrgProjectFilters from './filters'
import useOrganisationProjects from './useOrganisationProjects'
import OrgSearchProjectSection from './search/OrgSearchProjectSection'
import useProjectParams from './useProjectParams'
import useQueryChange from './useQueryChange'
import OrganisationProjectsOverview from './OrganisationProjectsOverview'

export default function OrganisationProjects() {
  const smallScreen = useMediaQuery('(max-width:767px)')
  const {isMaintainer} = useOrganisationContext()
  const {handleQueryChange} = useQueryChange()
  const {page, rows, view, setPageLayout} = useProjectParams()
  const {projects, count, loading} = useOrganisationProjects()
  const numPages = Math.ceil(count / rows)

  // console.group('OrganisationProjects')
  // console.log('projects...',projects)
  // console.log('view...', view)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('isMaintainer...',isMaintainer)
  // console.groupEnd()

  return (
    <>
      {isMaintainer && <UserAgreementModal />}
      {/* Page grid with 2 sections: left filter panel and main content */}
      <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
        {/* Filters panel large screen */}
        {smallScreen === false &&
          <FiltersPanel>
            <OrgProjectFilters />
          </FiltersPanel>
        }
        {/* Search & main content section */}
        <div className="flex-1">
          <OrgSearchProjectSection
            count={count}
            layout={view}
            setView={setPageLayout}
          />
          {/* Project overview/content */}
          <OrganisationProjectsOverview
            layout={view}
            projects={projects}
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
