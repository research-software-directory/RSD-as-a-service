// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {getTimeAgoSince} from '../../utils/dateFn'
import ImageAsBackground from '../layout/ImageAsBackground'
import {getImageUrl} from '../../utils/editImage'
import FeaturedIcon from '~/components/icons/FeaturedIcon'
import NotPublishedIcon from '~/components/icons/NotPublishedIcon'
import CardTitle from '../layout/CardTitle'
import {ProjectStatusKey} from '~/types/Project'
import ProjectStatus from './RelatedProjectStatus'

export type ProjectCardProps = Readonly<{
  slug: string,
  title: string,
  subtitle: string | null,
  image_id: string | null,
  updated_at: string | null,
  current_state?: ProjectStatusKey,
  is_featured?: boolean,
  is_published?: boolean,
  image_contain?: boolean | null,
  menuSpace?: boolean,
}>

export default function RelatedProjectsCard(
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
    <Link
      data-testid="project-card-link"
      href={projectUrl()}
      className={`flex flex-col h-full bg-base-200 text-content ${opacity} hover:bg-secondary hover:text-base-100`}
      passHref>
      <article className="flex-1 flex flex-col lg:flex-row h-full p-4 gap-4 overflow-hidden">
        <section
          title={subtitle ?? title}
          className="flex-3 h-full"
        >
          <ImageAsBackground
            alt={title}
            src={getImageUrl(image_id)}
            bgSize={image_contain ? 'contain' : 'cover'}
            bgPosition={image_contain ? 'center' : 'center center'}
            className="flex-1 h-full"
            noImgMsg='no image'
          />
        </section>
        <section className="flex-4 flex flex-col">
          <CardTitle
            title={title}
            className={titleMargin}
          >
            {renderIcon()} {title}
          </CardTitle>
          {/* <h2
            title={title}
            className={`max-h-[6rem] overflow-clip ${titleMargin}`}>
            {renderIcon()} {title}
          </h2> */}
          <p className="flex-1 my-4 overflow-auto">
            {subtitle}
          </p>
          <div className="flex justify-between text-sm">
            <span className="last-update">
              Updated {getTimeAgoSince(today,updated_at)}
            </span>
            <ProjectStatus status={current_state ?? 'unknown'} />
          </div>
        </section>
      </article>
    </Link>
  )
}
