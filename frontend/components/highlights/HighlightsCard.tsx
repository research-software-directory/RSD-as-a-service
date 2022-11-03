// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Tooltip} from '@mui/material'
import Link from 'next/link'
import CardTitle from '../layout/CardTitle'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'
import HighlightsCardLogo from './HighlightsCardLogo'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getTimeAgoSince} from '~/utils/dateFn'

export default function HighlightsCard({id, slug, brand_name, short_statement, is_featured,
  updated_at, mention_cnt, contributor_cnt, is_published, image_id}:SoftwareListItem) {
  const href = `/software/${slug}`
  // const colors = is_featured ? 'bg-base-300 text-content' : 'bg-base-200 text-content'
  const today = new Date()
  // if not published use opacity 0.50
  let opacity = ''
  if (typeof is_published !='undefined' && is_published===false) opacity='opacity-50'

  function mentionCntMessage() {
    return `${mention_cnt} mentions`
  }

  function contributorsMessage() {
    return `${contributor_cnt} contributors`
  }

  function renderPublished() {
    if (typeof is_published != 'undefined' && is_published === false) {
      return (
       <NotPublishedIcon />
      )
    }
    if (is_featured){
      return (
        <FeaturedIcon />
      )
    }
    return null
  }


  return (
    <Link
      href={href}
      className="flex flex-col h-full"
      passHref
    >
      <article
        className={`flex-1 flex flex-col bg-base-200 text-content ${opacity} hover:bg-secondary group overflow-hidden`}
      >
        <div className="relative flex pt-8 px-8 h-48">
          <HighlightsCardLogo image_id={image_id ?? ''} />
        </div>
        <div className="relative flex">
          <CardTitle
            title={brand_name}
            className="m-4 mr-[4rem]"
          >
            {renderPublished()} {brand_name}
          </CardTitle>
          {/* <h2
            title={brand_name}
            className="p-4 flex-1 mr-[4rem] group-hover:text-white line-clamp-3 max-h-[7rem]"
          >
            {renderPublished()} {brand_name}
          </h2> */}
        </div>
        <p className="flex-1 p-4 overflow-auto text-gray-800 group-hover:text-white">
          {short_statement}
        </p>
        <div className="flex justify-between p-4 text-sm group-hover:text-white">
          <span className="last-update">
            Updated {getTimeAgoSince(today, updated_at)}
          </span>
          <div className="flex gap-2">
          {mention_cnt &&
            <Tooltip title={mentionCntMessage()} placement="top">
              <span>
                <InsertCommentOutlinedIcon /> {mention_cnt}
              </span>
            </Tooltip>
          }
          {contributor_cnt &&
            <Tooltip title={contributorsMessage()} placement="top">
              <span>
                <PeopleAltOutlinedIcon /> {contributor_cnt}
              </span>
            </Tooltip>
          }
          </div>
        </div>
      </article>
    </Link>
  )
}
