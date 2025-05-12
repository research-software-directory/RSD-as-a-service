// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '@mui/material/Pagination'

import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import {useProfileContext} from '../context/ProfileContext'
import ProfileSoftwareOverview from './ProfileSoftwareOverview'
import ProfileSearchSoftware from './ProfileSearchSoftware'

export default function ProfileSoftware() {
  const {software_cnt,software} = useProfileContext()
  const {page,rows,view,setPageLayout} = useSoftwareParams()
  const {handleQueryChange} = useQueryChange()
  const numPages = Math.ceil(software_cnt / rows)

  // console.group('ProfileSoftware')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('software_cnt...', software_cnt)
  // console.log('software...', software)
  // console.log('view...', view)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.groupEnd()

  return (
    <div className="flex-1">
      <ProfileSearchSoftware
        count={software_cnt}
        layout={view}
        setView={setPageLayout}
      />
      {/* software overview/content */}
      <ProfileSoftwareOverview
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
  )
}
