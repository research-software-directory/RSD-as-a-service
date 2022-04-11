
import Link from 'next/link'
import Avatar from '@mui/material/Avatar'
import {ParticipatingOrganisationProps} from '../../types/Organisation'
import ImageAsBackground from '../layout/ImageAsBackground'

export default function OrganisationItem({slug, name, website, logo_url}: ParticipatingOrganisationProps) {

  function renderLogo() {
    if (logo_url) {
      return (
        <ImageAsBackground
          className="h-min-[3rem] h-max-[5rem] h-full"
          src={logo_url}
          alt={name}
          bgSize="contain"
        />
      )
    }
    return (
      <>
      <Avatar
        alt={name ?? ''}
        src={logo_url ?? ''}
        sx={{
          width: '4rem',
          height: '4rem',
          fontSize: '2rem',
          marginRight: '0.5rem',
          '& img': {
            height:'auto'
          }
        }}
        variant="square"
      >
        {name.slice(0,3)}
      </Avatar>
      <span>{name}</span>
      </>
    )
  }

  let url: string=''
  if (slug) {
    // internal RSD link to organisation
    url = `/organisations/${slug}`
    return (
      <Link href={url} passHref>
        <a
          title={name}
          className="flex items-center" rel="noreferrer">
          {renderLogo()}
        </a>
      </Link>
    )
  }

  if (website) {
    // organisation website
    url = website
    return (
      <a href={url} target="_blank"
        title={name}
        className="flex items-center" rel="noreferrer">
        {renderLogo()}
      </a>
    )
  }

  // should never happen
  return (
    <div
      title={name}
      className="flex">
      {renderLogo()}
    </div>
  )
}
