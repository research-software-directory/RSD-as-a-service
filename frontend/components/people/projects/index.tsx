// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Pagination from '@mui/material/Pagination'

import {setDocumentCookie} from '~/utils/userSettings'
import {useUserSettings} from '~/components/organisation/context/UserSettingsContext'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import useProjectParams from '~/components/organisation/projects/useProjectParams'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import {usePeopleContext} from '~/components/people/context/PeopleContext'
import ProfileSearchProjects from './PeopleSearchProjects'
import ProfileProjectOverview from './PeopleProjectOverview'

export default function ProfileProjects() {
  const {rsd_page_layout} = useUserSettings()
  const {project_cnt,projects} = usePeopleContext()
  const {page,rows} = useProjectParams()
  const {handleQueryChange} = useQueryChange()
  // if masonry we change to grid
  const initView = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  const [view, setView] = useState<ProjectLayoutType>(initView ?? 'grid')
  const numPages = Math.ceil(project_cnt / rows)

  function setLayout(view: ProjectLayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
  }

  return (
    <div className="flex-1">
      <ProfileSearchProjects
        count={project_cnt}
        layout={view}
        setView={setLayout}
      />
      {/* project overview/content */}
      <ProfileProjectOverview
        layout={view}
        projects={projects}
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
  )
}
