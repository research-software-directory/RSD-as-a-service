import Link from 'next/link'
import {OrganisationForOverview} from '../../types/Organisation'
import {getUrlFromLogoId} from '../../utils/editOrganisation'
import ImageAsBackground from '../layout/ImageAsBackground'

export default function OrganisationCard(organisation: OrganisationForOverview) {

  function renderCount() {
    const count = organisation.software_cnt ?? 0
    let label = 'software packages'
    if (organisation?.software_cnt === 1) label = 'software package'
    return (
      <div className="flex-1 flex flex-col px-8 py-4">
        <div className="flex-1 flex items-center justify-center text-[4rem] text-primary">
          {count}
        </div>
        <div className="flex items-center justify-center">
          {label}
        </div>
      </div>
    )
  }

  return (
    <Link
      href={`/organisation/${organisation.slug}`}
      passHref>
      <a>
        <div className="flex flex-col border rounded-sm p-4 h-full min-h-[16rem]">
          <h2 className='h-[4rem]'>{organisation.name}</h2>
          <div className="flex-1 flex">
            <div className="flex-1 flex items-center">
              <ImageAsBackground
                className="h-min-[3rem] h-max-[5rem] h-full"
                src={getUrlFromLogoId(organisation.logo_id)}
                alt={organisation.name}
                bgSize="contain"
                noImgMsg='no logo'
              />
            </div>
            {renderCount()}
          </div>
        </div>
      </a>
    </Link>
  )
}
