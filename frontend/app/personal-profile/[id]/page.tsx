// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import AboutTile from '../components/AboutTile'
import {getRsdToken} from 'app/_lib/auth'
import {getProfileData} from '../lib/getProfileData'

export default async function ProfilePage({params}: { params: Promise<{ id: string }> }) {
  const {id} = await params
  const token = await getRsdToken()
  const {profileData} = await getProfileData(id, token)

  if (!profileData) {
    return <p>Profile not found</p>
  }

  return (
      <AboutTile
        given_names={profileData!.given_names}
        family_names={profileData!.family_names}
        description={profileData!.description}
      />
  )
}
