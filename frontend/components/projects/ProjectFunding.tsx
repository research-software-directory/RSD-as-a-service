import Link from 'next/link'
import {ProjectOrganisationProps} from '~/types/Organisation'

export default function ProjectFunding({grant_id, fundingOrganisations=[]}:
  { grant_id: string | null, fundingOrganisations:ProjectOrganisationProps[] }) {
  if (grant_id === null) return null
  return (
    <div>
      <h4 className="text-primary py-4">Funded under</h4>
      <div className="text-sm">Grant ID: {grant_id}</div>
      {/* <i>No links available</i> */}
      <h4 className="text-primary py-4">Funded by</h4>
      <ul>
        {fundingOrganisations.map(item => {
          const link = `/organisations/${item.slug}`
          return (
            <Link
              key={link}
              href={link}
              passHref
            >
              <a target="_blank">
                <li className="text-sm py-1">
                  {item.name}
                </li>
              </a>
            </Link>
            )
        })}
      </ul>
    </div>
  )
}
