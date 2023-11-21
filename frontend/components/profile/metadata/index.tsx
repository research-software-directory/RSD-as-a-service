// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'
import EmailIcon from '@mui/icons-material/Email'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {RsdContributor} from '~/components/admin/rsd-contributors/useContributors'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import OrcidLink from '~/components/layout/OrcidLink'

function aggregateProfiles(profiles:RsdContributor[]|null){
  const name:string[]=[],affiliation:string[]=[],role:string[]=[],email:string[]=[]
  let logo:string|null=null, orcid:string|null=null, initials:string|null=null

  // const name:string =
  profiles?.forEach(item=>{
    // name
    const displayName = getDisplayName(item)
    if (displayName && name.includes(displayName)===false) {
      name.push(displayName)
    }
    if (initials===null) initials = getDisplayInitials(item)
    // orcid
    if (item.orcid && orcid===null) orcid=item.orcid
    // logo
    if (logo===null && item?.avatar_id) logo = item.avatar_id
    // affiliation
    if (item.affiliation && affiliation.includes(item.affiliation.trim())===false) affiliation.push(item.affiliation.trim())
    // roles
    if (item.role && role.includes(item.role.trim())===false) role.push(item.role.trim())
    // emails
    if (item.email_address && email.includes(item.email_address)===false) email.push(item.email_address)
  })

  return {
    name,
    initials,
    logo,
    affiliation,
    role,
    email,
    orcid
  }
}

export default function ProfileMetadata({profiles}:{profiles:RsdContributor[]|null}) {
  const {name, logo, initials, role, affiliation, email, orcid} = aggregateProfiles(profiles)
  return (
    <section className="grid md:grid-cols-[1fr,3fr] xl:grid-cols-[1fr,5fr] gap-4 mt-8">
      <BaseSurfaceRounded className="flex justify-center p-4 overflow-hidden relative">
        <Avatar
          alt={name[0] ?? ''}
          src={getImageUrl(logo ?? null) ?? ''}
          sx={{
            width: '10rem',
            height: '10rem',
            fontSize: '3.25rem'
          }}
        >
          {initials}
        </Avatar>
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="grid lg:grid-cols-[3fr,1fr] lg:gap-8 xl:grid-cols-[4fr,1fr] p-4">
        <div>
          <h1
            title={name[0]}
            className="text-xl font-medium line-clamp-1">
            {name}
          </h1>
          <p className="py-2">
            <OrcidLink orcid={orcid} />
          </p>
          {
            role?.length > 0 ?
              <p className="text-base-700 line-clamp-3 break-words py-1">
                <span className="text-base-content-disabled">Role(s)</span><br/>
                {role.join('; ')}
              </p>
              : null
          }
          {
            affiliation?.length > 0 ?
              <p className="text-base-700 line-clamp-3 break-words py-1">
                <span className="text-base-content-disabled">Affiliation(s)</span><br/>
                {affiliation.join('; ')}
              </p>
              : null
          }
        </div>
        <div className="flex flex-col gap-4">
          {email.map(item=>{
            return (
              <div key={item} className="flex gap-2"><EmailIcon /> {item}</div>
            )
          })}
        </div>
      </BaseSurfaceRounded>
    </section>
  )
}
