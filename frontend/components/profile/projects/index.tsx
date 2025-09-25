// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {ProfileProps} from '~/components/profile/software'
import {getProfileProjects} from '~/components/profile/apiProfile'
import ProfileSearchProjects from './ProfileSearchProjects'
import ProfileProjectOverview from './ProfileProjectOverview'

export default async function ProfileProjects({search,orcid,account,page,rows,token}:ProfileProps) {

  const data = await getProfileProjects({
    // api works with zero index
    page: page ? page-1 : 0,
    search,
    orcid,
    account,
    rows,
    token
  })
  if (data===null){
    return notFound()
  }

  const pages = Math.ceil(data.project_cnt / rows)

  // console.group('ProfileProjects')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('software_cnt...', data.software_cnt)
  // console.log('software...', data.software)
  // console.groupEnd()

  return (
    <div className="flex-1">
      <ProfileSearchProjects
        count={data.project_cnt}
        page={page}
        rows={rows}
        search={search}
      />

      {/* project overview/content */}
      <ProfileProjectOverview
        projects={data.projects}
      />

      {/* Pagination */}
      <PaginationLinkApp
        count={pages}
        page={page ?? 1}
        className='mt-4'
      />
    </div>
  )
}
