// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import {getTimeAgoSince} from '../../utils/dateFn'
import ImageAsBackground from '../layout/ImageAsBackground'
import {getImageUrl} from '../../utils/getProjects'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'

export type ProjectCardProps = {
  slug: string,
  title: string,
  subtitle: string | null,
  image_id: string | null,
  updated_at: string | null,
  current_state: 'Starting' | 'Running' | 'Finished',
  is_featured?: boolean,
  is_published?: boolean,
  image_contain?: boolean,
  menuSpace?: boolean,
}

export default function ProjectCard(
  {slug, title, subtitle, image_id, updated_at, current_state,
  is_featured, is_published, image_contain, menuSpace}: ProjectCardProps
) {
  // get current date
  const today = new Date()
  // if not published use opacity 0.50
  let opacity = ''
  if (typeof is_published != 'undefined' && is_published === false) opacity = 'opacity-50'
  // add margin to title to make space for more button
  const titleMargin = menuSpace ? 'mr-10':''

  function projectUrl() {
    return `/projects/${slug}/`
  }

  function renderIcon() {
    if (typeof is_published !='undefined' && is_published===false){
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
    <Link href={projectUrl()} passHref>
      <a className={`flex flex-col h-full bg-base-200 text-content ${opacity} hover:bg-secondary hover:text-white`}>
        <article className="flex flex-1 h-full px-4 overflow-hidden">
          <section
            title={subtitle ?? title}
            className="py-4 h-full md:w-[13rem]"
            >
            <ImageAsBackground
              alt={title}
              src={getImageUrl(image_id)}
              bgSize={image_contain ? 'contain' : 'cover'}
              bgPosition={image_contain ? 'center' : 'top center'}
              className="flex-1 h-full"
              noImgMsg='no image'
            />
          </section>
          <section className="flex flex-col flex-1 py-4 md:pl-6">
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
                Updated {getTimeAgoSince(today,updated_at)}
              </span>
              <div className="flex items-start justify-center">
                {current_state ?? 'Starting'}
              </div>
            </div>
          </section>
        </article>
      </a>
    </Link>
  )
}
