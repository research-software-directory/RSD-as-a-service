// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import EmailIcon from '@mui/icons-material/Email'
import Avatar from '@mui/material/Avatar'
import LaunchIcon from '@mui/icons-material/Launch'

import {Person} from '~/types/Contributor'
import {getImageUrl} from '~/utils/editImage'
import {getDisplayName, getDisplayInitials} from '~/utils/getDisplayName'
import LogoOrcid from '~/assets/logos/logo-orcid.svg'


export default function ContactPersonCard({person,section='software'}: {person: Person|null,section:'software'|'projects'}) {
  // what to render if no contact person?
  if (!person) return null
  const displayName = getDisplayName(person)

  function renderEmail() {
    if (person?.email_address) {
      return (
        <a className="flex items-start pt-4"
          href={`mailto:${person?.email_address}`}
          target="_blank" rel="noreferrer"
        >
          <EmailIcon sx={{
            mr: 1,
            '&:hover': {
              opacity: 'inherit'
            }
          }} color="primary" />
          Mail {person?.given_names}
        </a>
      )
    }
  }

  return (
    <article className="flex flex-col bg-base-100 max-w-md">
      <h3 className="text-center font-medium px-6 py-4 uppercase bg-primary text-base-100 md:text-left">Contact person</h3>
      <div className="flex flex-col p-8 gap-8 md:flex-row 2xl:flex-col">
        <Avatar
          alt={displayName ?? ''}
          src={getImageUrl(person.avatar_id) ?? ''}
          sx={{
            width: '7rem',
            height: '7rem',
            fontSize: '2rem',
            alignSelf: 'center'
          }}
        >
          {displayName ?
            getDisplayInitials(person)
            :null
          }
        </Avatar>
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
          {person?.role && <h5 className="pt-1">
            {person?.role}
          </h5>
          }
          {
            person?.affiliation && <h5 className="pt-1">
              {person?.affiliation}
            </h5>
          }
          {person?.orcid && <h5 className="pt-1">
            <a href={'https://orcid.org/' + person.orcid} target="_blank" rel="noreferrer"
              style={{whiteSpace:'nowrap'}}
            >
              <LogoOrcid className="inline max-w-[1.5rem] mr-2" />
              <span className="align-bottom">{person.orcid}</span>
            </a>
          </h5>}
          {renderEmail()}
        </div>
      </div>
    </article>
  )
}
