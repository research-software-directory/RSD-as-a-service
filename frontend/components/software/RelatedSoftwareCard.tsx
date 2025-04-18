// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined'

import {getTimeAgoSince} from '~/utils/dateFn'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'
import CardTitle from '~/components/layout/CardTitle'

export type SoftwareCardType = Readonly<{
  href: string
  brand_name: string
  short_statement: string,
  is_featured: boolean,
  updated_at: string | null
  mention_cnt?: number | null
  contributor_cnt: number | null
  is_published?: boolean
}>

export default function RelatedSoftwareCard({href, brand_name, short_statement, is_featured,
  updated_at, mention_cnt, contributor_cnt, is_published}: SoftwareCardType) {

  // const colors = is_featured ? 'bg-base-300 text-content' : 'bg-base-200 text-content'
  const today = new Date()
  // if not published use opacity 0.50
  let opacity = ''
  if (typeof is_published !='undefined' && is_published===false) opacity='opacity-50'

  function getInitals() {
    if (brand_name) {
      return brand_name.slice(0, 2).toUpperCase()
    }
    return ''
  }

  function mentionCntMessage() {
    if (mention_cnt && mention_cnt > 1) {
      return `${mention_cnt} mentions`
    }
    if (mention_cnt && mention_cnt === 1) {
      return `${mention_cnt} mention`
    }
    return ''
  }

  function contributorsMessage() {
    if (contributor_cnt && contributor_cnt > 1) {
      return `${contributor_cnt} contributors`
    }
    if (contributor_cnt && contributor_cnt === 1) {
      return `${contributor_cnt} contributor`
    }
    return ''
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
      data-testid="software-card-link"
      href={href}
      className="flex flex-col h-full"
      passHref>
      {/* anchor tag MUST be first element after Link component */}
      <article className={`flex-1 flex flex-col bg-base-200 text-content ${opacity} hover:bg-secondary group overflow-hidden`}>
        <div className="relative flex">
          <CardTitle
            title={brand_name}
            className="m-4 mr-[4rem]"
          >
            {renderPublished()} {brand_name}
          </CardTitle>
          <div
            className="flex w-[4rem] h-[4rem] justify-center items-center bg-base-100 text-base text-[1.5rem] absolute top-0 right-0 group-hover:text-secondary">
            {getInitals()}
          </div>
        </div>
        <p className="flex-1 p-4 overflow-auto text-base-800 group-hover:text-base-100">
          {short_statement}
        </p>
        <div className="flex justify-between p-4 text-sm group-hover:text-base-100">
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
