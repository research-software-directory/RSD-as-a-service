// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import NoContent from '~/components/layout/NoContent'
import {fetchProjectQuality} from './apiProjectQuality'
import ProjectQualityTable from './ProjectQualityTable'

export default async function ProjectQuality() {
  const {token} = await getUserSettings()
  const user = await getUserFromToken(token)
  const isAdmin = user?.role === 'rsd_admin'

  const data = await fetchProjectQuality(isAdmin,token)

  // console.group('ProjectQuality')
  // console.log('token...', token)
  // console.log('showAll...', showAll)
  // console.log('data...', data)
  // console.log('dataLoaded...', dataLoaded)
  // console.groupEnd()

  if (data.length === 0) {
    return <NoContent />
  }

  return (
    <BaseSurfaceRounded
      className="flex-1 p-4"
      type="section"
    >
      <ProjectQualityTable data={data} isAdmin={isAdmin} />
    </BaseSurfaceRounded>
  )
}
