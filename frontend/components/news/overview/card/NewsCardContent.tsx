// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import {NewsListItem} from '~/components/news/apiNews'
import PublicationDate from './PublicationDate'
import NewsAuthors from './NewsAuthors'
import NewsCardTextBody from './NewsCardTextBody'

export default function NewsCardContent({item}:{item:NewsListItem}) {
  // construct image url
  let imgUrl=null
  if (item.image_for_news?.length>0){
    imgUrl = `${getImageUrl(item.image_for_news[0].image_id) ?? ''}`
  }

  return (
    <div
      data-testid="project-card-content"
      className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
      {/* Cover image */}
      <div className="h-[45%] flex overflow-hidden relative bg-base-100">
        <ImageWithPlaceholder
          src={imgUrl}
          alt={`Image of article ${item.title}`}
          type="gradient"
          className={'w-full text-base-content-disabled'}
          bgSize={'cover'}
        />
      </div>
      {/* Card body */}
      <div className="h-[55%] flex flex-col p-4 relative">
        <PublicationDate
          publication_date={item.publication_date}
          className='py-2'
        />
        <NewsCardTextBody
          title={item.title}
          summary={item.summary}
        />
        <div className="flex-1 flex flex-col justify-end">
          <NewsAuthors
            author={item.author}
            className='pt-2'
          />
        </div>
      </div>
    </div>
  )
}
