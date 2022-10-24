// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getTimeAgoSince} from '../../utils/dateFn'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined'
import {Tooltip} from '@mui/material'

export type SoftwareCardType = {
  href: string
  brand_name: string
  short_statement: string,
  is_featured: boolean,
  updated_at: string | null
  mention_cnt?: number | null
  contributor_cnt: number | null
  is_published?: boolean
}

export default function SoftwareCard({
                                       href, brand_name, short_statement, is_featured,
                                       updated_at, mention_cnt, contributor_cnt, is_published
                                     }: SoftwareCardType) {

  // const colors = is_featured ? 'bg-base-300 text-content' : 'bg-base-200 text-content'
  const today = new Date()

  // if not published use opacity 0.50
  let opacity = ''
  if (typeof is_published !== 'undefined' && !is_published) opacity = 'opacity-50'

  function getInitals() {
    return brand_name?.slice(0, 2).toUpperCase() || ''
  }

  function renderPublished() {
    if (typeof is_published !== 'undefined' && !is_published) {
      return (
        <NotPublishedIcon/>
      )
    }

    if (is_featured) {
      return (
        <FeaturedIcon/>
      )
    }
    return null
  }

  return (
    <Link href={href} passHref>
      {/* anchor tag MUST be first element after Link component */}
      <a className="flex flex-col h-full">
        <div
          className={`flex-1 flex flex-col bg-base-200 text-content ${opacity} hover:bg-secondary group`}>
          <div className="relative flex">
            <h2
              className={`p-4 flex-1 mr-[4rem] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white`}>
              {/*Title and initials*/}
              <div className="flex pt-3 relative min-h-[5rm]">
                <div
                  title={brand_name}
                  className="text-lg font-medium line-clamp-2 px-4 flex-1 mr-[4rem] group-hover:text-white"
                >
                  {renderPublished()} {brand_name}
                </div>
                <div
                  className="flex w-[4rem] h-[4rem] justify-center items-center bg-white text-base text-2xl absolute top-0 right-0 group-hover:text-secondary">
                  {getInitals()}
                </div>
              </div>

              {/*description and more information*/}
              <div>
                <p className="px-4 my-2 line-clamp-3 text-gray-800 group-hover:text-white">
                  {short_statement}
                </p>
                <div className="flex justify-between p-4 text-sm group-hover:text-white opacity-60">
                  <div> {getTimeAgoSince(today, updated_at)} </div>
                  <div className="flex gap-3">

                    {contributor_cnt &&
                      <Tooltip title="Contributors" placement="top">
                        <div>
                          <PeopleAltOutlinedIcon className="w-5 h-5 "/> {contributor_cnt}
                        </div>
                      </Tooltip>}

                    {mention_cnt &&
                      <Tooltip title="Mentions" placement="top">
                        <div>
                          <TurnedInNotOutlinedIcon className="w-5 h-5 "/> {mention_cnt}
                        </div>
                      </Tooltip>}

                    {is_featured &&
                      <Tooltip title="Feature Software" placement="top">
                        <PushPinOutlinedIcon className="rotate-45 w-5 h-5 "/>
                      </Tooltip>}
                  </div>
                </div>
              </div>
        </div>
        </div>
      </a>
    </Link>
  )
}
