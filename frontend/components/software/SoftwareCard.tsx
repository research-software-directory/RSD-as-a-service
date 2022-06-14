// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getTimeAgoSince} from '../../utils/dateFn'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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

export default function SoftwareCard({href, brand_name, short_statement, is_featured,
  updated_at, mention_cnt, contributor_cnt, is_published}: SoftwareCardType) {

  const colors = is_featured ? 'bg-primary text-white' : 'bg-grey-100 text-grey-800'
  let opacity = ''
  const today = new Date()
  // if not published use opacity 0.50
  if (typeof is_published !='undefined' && is_published===false) opacity='opacity-50'

  function getInitals() {
    if (brand_name) {
      return brand_name.slice(0,2).toUpperCase()
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

  function renderCounts() {
    let message = mentionCntMessage()
    if (message) {
      message+=`, ${contributorsMessage()}`
    } else {
      message=contributorsMessage()
    }
    if (message) {
      return (
        <div className="flex items-start justify-center">
          {/* <StarIcon sx={{height:'1rem'}} /> */}
          {message}
        </div>
      )
    }
    return null
  }

  function renderPublished() {
    if (typeof is_published !='undefined' && is_published===false){
      return (
        <span
          title="Not published"
        >
          <VisibilityOffIcon
            sx={{
              width: '2rem',
              height: '2rem',
              margin: '0 0.5rem 0.5rem 0'
            }}
          />
        </span>
      )
    }
    return null
  }

  return (
    <Link href={href} passHref>
      <a className="flex flex-col h-full">
        <article className={`flex-1 flex flex-col ${colors} ${opacity} hover:bg-secondary hover:text-white`}>
          <div className="flex relative">
            <h2
              title={brand_name}
              className="p-4 flex-1 mr-[4rem] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {renderPublished()} {brand_name}
            </h2>
            <div
              className="flex w-[4rem] h-[4rem] justify-center items-center bg-white text-gray-800 text-[1.5rem]"
              style={{position:'absolute',right:0,top:0}}
            >
              {getInitals()}
            </div>
          </div>
          <p className="flex-1 p-4 overflow-auto max-h-[9.75rem]">
            {short_statement}
          </p>
          <div className="flex justify-between p-4 text-sm">
            <span className="last-update">
              Updated {getTimeAgoSince(today,updated_at)}
            </span>
            {renderCounts()}
          </div>
        </article>
      </a>
    </Link>
  )
}
