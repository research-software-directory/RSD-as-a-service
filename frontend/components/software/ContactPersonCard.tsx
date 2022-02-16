/* eslint-disable @next/next/no-img-element */
import EmailIcon from '@mui/icons-material/Email'
import Avatar from '@mui/material/Avatar'

import {Contributor} from '../../types/Contributor'
import {getDisplayName, getDisplayInitials} from '../../utils/getDisplayName'


export default function ContactPersonCard({person}: { person: Contributor|null }) {
  // what to render if no contact person?
  if (!person) return null
  const displayName = getDisplayName(person)

  function renderEmail() {
    if (person?.email_address) {
      return (
        <a className="flex items-center md:items-start"
          href={`mailto:${person?.email_address}`}>
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
    <article className="flex flex-col bg-white max-w-md">
      <h3 className="text-center font-medium px-6 py-4 uppercase bg-primary text-white md:text-left">Contact person</h3>
      <div className="flex flex-col p-6 md:flex-row 2xl:flex-col">
        {/* <div className="self-center md:mr-8 2xl:mr-0"> */}
        <Avatar
          alt={displayName ?? ''}
          src={person.avatar_url ?? ''}
          sx={{
            width: '7rem',
            height: '7rem',
            fontSize: '2rem',
            alignSelf: 'center',
            marginRight:['0rem','2rem']
          }}
        >
          {displayName ?
            getDisplayInitials(person)
            :null
          }
        </Avatar>
        {/* </div> */}
        <div className="flex-1 flex flex-col items-center py-4 md:items-start lg:pt-8">
          <h4 className="text-primary text-2xl">{displayName}</h4>
          <h5 className="py-2">
            {person?.affiliation ?? ''}
          </h5>
          {renderEmail()}
        </div>
      </div>
    </article>
  )
}
