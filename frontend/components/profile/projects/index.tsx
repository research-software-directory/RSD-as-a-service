// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '@mui/material/Pagination'

import useProjectParams from '~/components/organisation/projects/useProjectParams'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import {useProfileContext} from '~/components/profile/context/ProfileContext'
import ProfileSearchProjects from './ProfileSearchProjects'
import ProfileProjectOverview from './ProfileProjectOverview'

export default function ProfileProjects() {
  const {project_cnt,projects} = useProfileContext()
  const {page,rows,view,setPageLayout} = useProjectParams()
  const {handleQueryChange} = useQueryChange()
  const numPages = Math.ceil(project_cnt / rows)

  return (
    <div className="flex-1">
      <ProfileSearchProjects
        count={project_cnt}
        layout={view}
        setView={setPageLayout}
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
