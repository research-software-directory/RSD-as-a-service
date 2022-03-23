import {Avatar} from '@mui/material'
import Link from 'next/link'
import {OrganisationForOverview} from '../../types/Organisation'
import {getUrlFromLogoId} from '../../utils/editOrganisation'

export default function OrganisationCard(organisation: OrganisationForOverview) {

  function getCountAndLabel() {
    const count = organisation.software_cnt ?? 0
    let label = 'software packages'
    if (organisation?.software_cnt === 1) label = 'software package'
    return {
      count,
      label
    }
  }

  const {count, label} = getCountAndLabel()

  return (
    <Link
      href={`/organisation/${organisation.slug}`}
      passHref>
      <a>
        <div className="flex flex-col border rounded-sm p-4 h-full min-h-[16rem]">
          <h2 className='h-[4rem]'>{organisation.name}</h2>
          <div className="flex-1 flex">
            <div className="flex-1 flex items-center">
              <Avatar
                alt={organisation.name ?? ''}
                src={getUrlFromLogoId(organisation.logo_id) ?? ''}
                sx={{
                  width: '100%',
                  height: '100%',
                  fontSize: '3rem',
                  '& img': {
                    height:'auto'
                  }
                }}
                variant="square"
              >
                {organisation.name.slice(0,3)}
              </Avatar>
            </div>
             <div className="flex-1 flex flex-col px-8 py-4">
              <div className="flex-1 flex items-center justify-center text-[4rem] text-primary">
                {count}
              </div>
              <div className="flex items-center justify-center">
                {label}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
