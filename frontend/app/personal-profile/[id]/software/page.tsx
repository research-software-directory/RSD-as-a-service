// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import RsdOverview from 'app/(overviews)/components/RsdOverview'
import RsdSearchSection from 'app/(overviews)/components/RsdSearchSection'
import {LayoutType} from 'app/(overviews)/components/ViewToggleGroup'
import {getRsdToken} from 'app/_lib/auth'
import {getProfileData} from 'app/personal-profile/lib/getProfileData'
import UserSoftwareOverview from '~/components/user/software/UserSoftwareOverview'

export default async function ProfileSoftwarePage({params}: { params: Promise<{ id: string, route: string }> }) {
  const {id, route} = await params
  const token = await getRsdToken()
  const {profileSoftware} = await getProfileData(id, token)

  return (
    <>
      {route}
      <RsdOverview
        overviewType='user software'
        items={profileSoftware.software}
        searchPlaceholder='Search their software'
      />
    </>
  )
}
