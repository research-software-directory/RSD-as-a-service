// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import {getTimeAgoSince} from '../../utils/dateFn'
import ImageAsBackground from '../layout/ImageAsBackground'
import {getImageUrl} from '../../utils/getProjects'

export type ProjectCardProps = {
  slug: string
  title: string
  subtitle: string | null
  image_id: string | null
  updated_at: string | null
  date_end: string | null
  is_featured?: boolean
  is_published?: boolean
  menuSpace?: boolean
}

export default function ProjectCard({slug, title, subtitle, image_id, updated_at, date_end,
  is_featured, is_published, menuSpace}: ProjectCardProps) {
  // get current date
  const today = new Date()
  // featured has primary bg color
  const colors = is_featured ? 'bg-primary text-white' : 'bg-grey-100 text-gray-800'
  // if not published use opacity 0.50
  let opacity = ''
  if (typeof is_published != 'undefined' && is_published === false) opacity = 'opacity-50'
  // add margin to title to make space for more button
  const titleMargin = menuSpace ? 'mr-8':''

  function renderStatus() {
    try {
      if (date_end) {
        const endDate = new Date(date_end)
        if (today > endDate) return 'Finished'
        return 'Running'
      }
      return 'Starting'
    } catch (e) {
      return null
    }
  }

  function projectUrl() {
    return `/projects/${slug}/`
  }

  function renderIcon() {
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
    <Link href={projectUrl()} passHref>
      <a className={`flex flex-col h-full ${colors} ${opacity} hover:bg-secondary hover:text-white`}>
        <article className="flex-1 flex px-4 h-full overflow-hidden">
          <section
            title={subtitle ?? title}
            className="py-4 h-full md:w-[13rem]"
            >
            <ImageAsBackground
              alt={title}
              src={getImageUrl(image_id)}
              className="flex-1 h-full"
              noImgMsg='no image'
            />
          </section>
          <section className="flex-1 flex flex-col py-4 pl-6">
            <h2
              title={title}
              className={`max-h-[6rem] overflow-clip ${titleMargin}`}>
              {renderIcon()} {title}
            </h2>

            <p className="flex-1 py-4 overflow-auto">
              {subtitle}
            </p>
            <div className="flex justify-between text-sm">
              <span className="last-update">
                {getTimeAgoSince(today,updated_at)}
              </span>
              <div className="flex items-start justify-center">
                {renderStatus()}
              </div>
            </div>
          </section>
        </article>
      </a>
    </Link>
  )
}
