// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import EmailIcon from '@mui/icons-material/Email'
import LaunchIcon from '@mui/icons-material/Launch'

import {Person} from '~/types/Contributor'
import {getImageUrl} from '~/utils/editImage'
import {getDisplayName, getDisplayInitials} from '~/utils/getDisplayName'
import PersonalInfo from './PersonalInfo'
import ContributorAvatar from './ContributorAvatar'

type MailToType=Readonly<{
  email_address: Person['email_address'],
  given_names: Person['given_names'],
}>

export function MailToLink({email_address,given_names}:MailToType){
  if (email_address) {
    return (
      <a className="flex-1 flex gap-1 items-end text-sm"
        href={`mailto:${email_address}`}
        target="_blank" rel="noreferrer"
      >
        <EmailIcon sx={{
          '&:hover': {
            opacity: 'inherit'
          }
        }} color="primary" />
        Mail {given_names}
      </a>
    )
  }
  return null
}

type ContactPersonCardProps=Readonly<{
  person: Person|null,
  section:'software'|'projects'
}>


export default function ContactPersonCard({person,section='software'}:ContactPersonCardProps) {
  // what to render if no contact person?
  if (!person) return null
  const displayName = getDisplayName(person)

  return (
    <section
      aria-label="Contact person"
      className="flex flex-col bg-base-100 max-w-md">
      <h3 className="text-center font-medium px-6 py-4 uppercase bg-primary text-base-100 md:text-left">
        Contact person
      </h3>
      <div className="flex flex-col p-8 gap-8 md:flex-row 2xl:flex-col">
        <ContributorAvatar
          avatarUrl={getImageUrl(person.avatar_id) ?? ''}
          displayName={displayName}
          displayInitials={getDisplayInitials(person)}
          size={7}
          sx={{
            alignSelf: 'center'
          }}
        />
        <div className="flex-1 flex flex-col items-start">
          <h4 className="text-primary text-2xl">
            {person?.is_public ?
              <a href={`/persons/${person.account}/${section}`}>
                {displayName} <LaunchIcon sx={{width:'1rem'}}/>
              </a>
              :
              <>{displayName}</>
            }
          </h4>
          <PersonalInfo {...person}>
            <MailToLink {...person}/>
          </PersonalInfo>
        </div>
      </div>
    </section>
  )
}
