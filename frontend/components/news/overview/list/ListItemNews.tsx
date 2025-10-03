// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {useSession} from '~/auth/AuthProvider'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import StatusBanner from '~/components/cards/StatusBanner'
import {NewsListItem, getCardImageUrl} from '~/components/news/apiNews'
import PublicationDate from '~/components/news/overview/card/PublicationDate'
import NewsAuthors from '~/components/news/overview/card/NewsAuthors'
import {getMenuOptions} from '~/components/news/overview/card/NewsCardNav'
import useOnNewsAction from '~/components/news/overview/useOnNewsAction'

type ListItemProps=Readonly<{
  item:NewsListItem
}>

export function ListItemNav({item}:ListItemProps){
  const onNewsAction = useOnNewsAction()
  const {user} = useSession()

  if (user?.role === 'rsd_admin'){
    return (
      <div className="bg-base-100 rounded-[50%] mr-2">
        <IconBtnMenuOnAction
          options={getMenuOptions(item)}
          onAction={onNewsAction}
        />
      </div>
    )
  }
  return null
}


export default function ListItemNews({item}:ListItemProps) {
  // construct image url
  const imgUrl = getCardImageUrl(item.image_for_news)

  return (
    <OverviewListItem className="flex-none">
      <Link
        data-testid="project-list-item"
        key={item.id}
        href={`/news/${item.publication_date}/${item.slug}`}
        className='flex-1 flex items-center hover:text-inherit bg-base-100 rounded-xs'
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgUrl}
          alt = {`Cover image for ${item.title}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
              {item.title}
            </div>
            <div className='line-clamp-4 md:line-clamp-2 break-words text-sm opacity-70'>
              {item.summary}
            </div>
            {/* project status - admin only */}
            <div className="pt-2 flex gap-2 text-xs opacity-60">
              <StatusBanner
                status="approved"
                is_featured={false}
                is_published={item.is_published}
                width='auto'
                borderRadius='0.125rem'
              />
            </div>
          </div>
          {/* publication date and authors */}
          <div className="md:pr-4 md:text-right">
            <PublicationDate
              publication_date={item.publication_date}
            />
            <NewsAuthors
              author={item.author}
              className='pt-2'
            />
          </div>
        </div>
      </Link>
      {/* rsd admin navigation */}
      <ListItemNav item={item} />
    </OverviewListItem>
  )
}
