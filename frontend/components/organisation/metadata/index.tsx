import Link from 'next/link'
import {RORItem} from '~/utils/getROR'
import OrganisationLogo from './OrganisationLogo'
import PlaceIcon from '@mui/icons-material/Place'
import Chip from '@mui/material/Chip'
import {OrganisationForOverview} from '~/types/Organisation'

type OrgnisationInfoProps = {
  organisation: OrganisationForOverview,
  meta: RORItem|null,
  isMaintainer: boolean
}

export function UnderlinedTitle({title}:{title: string}) {
  return (
    <>
      <h4 className="pt-2 text-base-content-disabled">{title}</h4>
      <hr className="pb-2" />
    </>
  )
}

export function RorLocation({meta}: { meta: RORItem | null }) {
  try {
    if (meta===null) return null
    const location = meta.addresses[0]
    if (location) {
      const country = meta.country.country_name
      const {lng,lat} = location
      if (lng && lat) {
        const query = encodeURIComponent(`${meta.name},${location.city},${country}`)
        return (
          <>
            <UnderlinedTitle title='Location' />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              passHref
            >
            <a target="_blank">
              <div className="flex gap-2">
                <PlaceIcon sx={{
                  width: '1.5rem',
                  height:'1.5rem'
                }} />
                <div>
                  <div>{meta.name}</div>
                  <div>{location.city}, {country}</div>
                </div>
              </div>
            </a>
            </Link>
          </>
        )
      }
      return null
    }
    return null
  } catch (e) {
    return null
  }
}

export function Links({links=[]}:{links:string[]}) {
  try {
    if (links.length===0) return null
    return (
      <>
        <UnderlinedTitle title='Links' />
        {links.map(item => (
          <Link
            key={item}
            href={item}
            passHref
          >
            <a target="_blank">
              <div
                title={item}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{item}</div>
            </a>
          </Link>
        ))}
      </>
    )
  } catch (e) {
    return null
  }
}

export function RorTypes({meta}:{meta:RORItem|null}) {
  try {
    if (meta===null) return null
    return (
      <>
        <UnderlinedTitle title='Type' />
        <div className="flex">
          {meta.types.map(item => (
            <Chip
            key={item}
            title={item}
            label={item}
            sx={{
              marginBottom: '1rem',
              marginRight: '0.5rem',
              maxWidth: '19rem',
              borderRadius: '0rem 0.5rem',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              textTransform: 'uppercase',
              letterSpacing: '0.125rem'
            }}
          />
        ))}
        </div>
      </>
    )
  } catch (e) {
    return null
  }
}


export default function OrganisationMetadata({organisation, meta, isMaintainer}: OrgnisationInfoProps) {

  function getAllLinks() {
    const links:string[] = []
    if (organisation.website) {
      // website as first link
      links.push(organisation.website)
    }
    if (meta && meta.links) {
      meta.links.forEach(item => {
        // add only new items
        if (links.indexOf(item) === -1) {
          links.push(item)
        }
      })
    }
    // meta.id is ror_id url
    if (meta && meta.id && links.indexOf(meta.id) === -1) {
      // add only new items
      links.push(meta.id)
    }
    // some organisations provide wikipedia page
    if (meta && meta?.wikipedia_url && links.indexOf(meta?.wikipedia_url) === -1) {
      links.push(meta?.wikipedia_url)
    }
    return links
  }

  function renderInfo() {
    // if no metadata but website is provided
    if (meta === null && organisation.website) {
      // we return one link
      return (
        <Links links={[organisation.website]} />
      )
    } else if (meta) {
      // if ror_id is valid (meta is present) we
      // merge all links from meta and organisation.website
      const links = getAllLinks()
      return (
        <>
          <RorTypes meta={meta} />
          <RorLocation meta={meta} />
          <Links links={links} />
        </>
      )
    }
    // if no meta and no website we return nothing
    return null
  }

  return (
    <div className="my-8 p-6 border min-h-[9rem] max-w-[20rem]"
      style={{
        borderRadius:'0rem 2rem'
      }}
    >
      <OrganisationLogo
        isMaintainer={isMaintainer}
        {...organisation}
      />
      {renderInfo()}
    </div>
  )
}
