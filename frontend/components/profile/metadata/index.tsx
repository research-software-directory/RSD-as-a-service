// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import PersonalInfo from '~/components/software/PersonalInfo'
import {PublicUserProfile} from '~/components/user/settings/profile/apiUserProfile'

type ProfileMetadataProps= Readonly<{
  profile: PublicUserProfile
}>

export default function ProfileMetadata({profile}:ProfileMetadataProps) {
  const name = getDisplayName(profile)
  const initials = getDisplayInitials(profile)
  return (
    <section className="grid md:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_5fr] gap-4 mt-8">
      <BaseSurfaceRounded className="flex justify-center p-4 overflow-hidden relative">
        <Avatar
          alt={name ?? ''}
          src={getImageUrl(profile?.avatar_id ?? null) ?? ''}
          sx={{
            width: '10rem',
            height: '10rem',
            fontSize: '3.25rem'
          }}
        >
          {initials}
        </Avatar>
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="p-4">
        <h1
          title={name ?? ''}
          className="text-2xl font-medium line-clamp-1 pb-4">
          {name ?? ''}
        </h1>
        <PersonalInfo {...profile}/>
      </BaseSurfaceRounded>
    </section>
  )
}
