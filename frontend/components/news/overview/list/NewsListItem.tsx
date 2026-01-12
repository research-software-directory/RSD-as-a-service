// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSession} from '~/auth/AuthProvider'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import StatusBanner from '~/components/cards/StatusBanner'
import {NewsListItemProps, getCardImageUrl} from '~/components/news/apiNews'
import PublicationDate from '~/components/news/overview/card/PublicationDate'
import NewsAuthors from '~/components/news/overview/card/NewsAuthors'
import {getMenuOptions} from '~/components/news/overview/card/NewsCardNav'
import useOnNewsAction from '~/components/news/overview/useOnNewsAction'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import ListTitleSubtitle from '~/components/layout/ListTitleSubtitle'

type ListItemProps=Readonly<{
  item:NewsListItemProps
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


export default function NewsListItem({item}:ListItemProps) {
  // construct image url
  const imgUrl = getCardImageUrl(item.image_for_news)

  return (
    <OverviewListItem className="flex-none">
      <OverviewListItemLink
        href={`/news/${item.publication_date}/${item.slug}`}
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgUrl}
          alt = {`Cover image for ${item.title}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <ListTitleSubtitle
              title={item.title}
              subtitle={item.summary}
            />
            {/* news status - admin only */}
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
      </OverviewListItemLink>
      {/* rsd admin navigation */}
      <ListItemNav item={item} />
    </OverviewListItem>
  )
}
