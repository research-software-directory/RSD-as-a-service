// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import PersonalInfo from '~/components/software/PersonalInfo'
import {RsdContributor} from '~/components/admin/rsd-contributors/useContributors'
import {UserProfile} from '~/components/user/settings/profile/apiUserProfile'

function aggregateProfiles(profiles:RsdContributor[]|null,user:UserProfile|null){
  let name:string|null=null,
    affiliation:string|null=null,
    role:string|null=null,
    avatar_id:string|null=null,
    orcid:string|null=null,
    initials:string|null=null

  if (user && profiles){
    name = getDisplayName(user)
    initials = getDisplayInitials(user)
    role = user.role
    affiliation = user.affiliation
    avatar_id = user.avatar_id
    orcid = profiles[0].orcid
  }else {
    // extract info from contributor/team member entries
    profiles?.forEach(item=>{
      // name
      const displayName = getDisplayName(item)
      // validate display name
      if (name===null && displayName){
        name = displayName
        // initals - to be used if no image present
        if (initials===null) initials = getDisplayInitials(item)
      }
      // orcid - should be only 1 orcid
      if (item.orcid && orcid===null) orcid=item.orcid
      // logo - use first image found
      if (avatar_id===null && item?.avatar_id) avatar_id = item.avatar_id
      // affiliation
      if (affiliation===null && item.affiliation){
        affiliation = item.affiliation
      }
      // roles
      if (role===null && item.role){
        role = item.role
      }
    })
  }

  return {
    name,
    initials,
    avatar_id,
    affiliation,
    role,
    orcid
  }
}


type ProfileMetadataProps= Readonly<{
  profiles:RsdContributor[]|null
  user: UserProfile|null
}>

export default function ProfileMetadata({profiles,user}:ProfileMetadataProps) {
  const {name, avatar_id, initials, orcid, role, affiliation} = aggregateProfiles(profiles,user)
  return (
    <section className="grid md:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_5fr] gap-4 mt-8">
      <BaseSurfaceRounded className="flex justify-center p-4 overflow-hidden relative">
        <Avatar
          alt={name ?? ''}
          src={getImageUrl(avatar_id ?? null) ?? ''}
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
        <PersonalInfo
          role={role}
          affiliation={affiliation}
          orcid={orcid}
        />
      </BaseSurfaceRounded>
    </section>
  )
}
