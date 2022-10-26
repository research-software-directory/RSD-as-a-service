// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getTimeAgoSince} from '~/utils/dateFn'
import {Tooltip} from '@mui/material'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined'

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
      {/* Anchor tag MUST be first element after Link component */}
      <a className={`flex flex-col h-full bg-base-200 text-content ${opacity} hover:bg-secondary group`}>
        {/* Title and initials*/}
        <div className="flex group-hover:text-white">
          <div className="line-clamp-2 max-h-16 h-full pt-3 p-4 text-lg font-medium flex-1 group-hover:text-white">
            {renderPublished()} {brand_name}
          </div>
          <div className="flex justify-center items-center w-16 h-16 bg-white text-base text-2xl group-hover:text-secondary">
            {getInitals()}
          </div>
        </div>
        {/* Description and more information*/}
        <div className="flex flex-col h-full">
          <p className="flex-1 px-4 my-2 line-clamp-3 text-gray-800 group-hover:text-white">
            {short_statement}
          </p>
          <div className="flex justify-between p-4 text-sm group-hover:text-white opacity-60">
            <Tooltip title="Updated" placement="top">
              <div> {getTimeAgoSince(today, updated_at)} </div>
            </Tooltip>
            <div className="flex gap-3">

              {contributor_cnt &&
                <Tooltip title="Contributors" placement="top">
                  <div>
                    <PeopleAltOutlinedIcon className="scale-[0.8]"/> {contributor_cnt}
                  </div>
                </Tooltip>}

              {mention_cnt &&
                <Tooltip title="Mentions" placement="top">
                  <div>
                    <TurnedInNotOutlinedIcon className="scale-[0.8]"/> {mention_cnt}
                  </div>
                </Tooltip>}

              {is_featured &&
                <Tooltip title="Feature Software" placement="top">
                  <PushPinOutlinedIcon className="rotate-45 scale-[0.8]"/>
                </Tooltip>}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
