// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {getProfileSoftware} from '~/components/profile/apiProfile'
import ProfileSearchSoftware from './ProfileSearchSoftware'
import ProfileSoftwareOverview from './ProfileSoftwareOverview'

export type ProfileProps=Readonly<{
  search?: string|null
  orcid: string|null
  account: string|null
  page: number
  rows: number
  token?: string
}>

export default async function ProfileSoftware({search,orcid,account,page,rows,token}:ProfileProps) {

  const data = await getProfileSoftware({
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

  const pages = Math.ceil(data.software_cnt / rows)

  // console.group('ProfileSoftware')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('software_cnt...', data.software_cnt)
  // console.log('software...', data.software)
  // console.groupEnd()

  return (
    <div className="flex-1">
      <ProfileSearchSoftware
        count={data.software_cnt}
        page={page}
        rows={rows}
        search={search}
      />

      {/* software overview/content */}
      <ProfileSoftwareOverview
        software={data.software}
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
