// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
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

export default function SoftwareCard({
                                       href, brand_name, short_statement, is_featured,
                                       updated_at, mention_cnt, contributor_cnt, is_published
                                     }: SoftwareCardType) {

  const colors = is_featured ? 'bg-base-300 text-content' : 'bg-base-200 text-content'
  const today = new Date()

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

  function renderCounts() {
    let message = mentionCntMessage()
    if (message) {
      message += `, ${contributorsMessage()}`
    } else {
      message = contributorsMessage()
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
    if (typeof is_published != 'undefined' && is_published === false) {
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
      <section className="h-full">
        <a
          className={`flex flex-col h-full ${colors} hover:bg-secondary group`}>

          <div className="flex relative">
            <h2
              title={brand_name}
              className="p-4 flex-1 mr-[4rem] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white"
            >
              {renderPublished()} {brand_name}
            </h2>
            <div
              className="flex w-[4rem] h-[4rem] justify-center items-center bg-white text-base text-[1.5rem] absolute top-0 right-0 group-hover:text-secondary">
              {getInitals()}
            </div>
          </div>
          <p className="flex-1 p-4 overflow-auto max-h-[9.75rem] text-gray-800 group-hover:text-white">
            {short_statement}
          </p>
          <div className="flex justify-between p-4 text-sm group-hover:text-white">
            <span className="last-update">
              Updated {getTimeAgoSince(today, updated_at)}
            </span>
            {renderCounts()}
          </div>
        </a>
      </section>
    </Link>
  )
}
