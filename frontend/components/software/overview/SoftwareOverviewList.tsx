// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import List from '@mui/material/List'
import Img from 'next/image'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import ContributorIcon from '~/components/icons/ContributorIcon'
import MentionIcon from '~/components/icons/MentionIcon'
import DownloadsIcon from '~/components/icons/DownloadsIcon'

export default function SoftwareOverviewList({software = []}: { software: SoftwareListItem[] }) {
  return (
    <section className="flex-1 mt-2">
      <List>
        {software.map(item => (
          <Link
            key={item.id}
            href={`/software/${item.slug}`}
            className='hover:text-inherit'
          >
            <div className='flex gap-2 p-2 transition shadow-sm border bg-base-100 mb-2 rounded' >
              {item.image_id &&
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-12 h-12 rounded-sm object-cover"
                  src={getImageUrl(item.image_id) ?? ''}
                  alt={`Cover image for ${item.brand_name}`}
                />}

              <div className="flex flex-col md:flex-row gap-3 flex-1">
                <div className="flex-1">
                  <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
                  {item.brand_name}
                  </div>
                  <div className='line-clamp-3 md:line-clamp-1 break-words text-sm opacity-70'>
                    {item.short_statement}
                  </div>
                </div>

                {/* Indicators */}
                <div className="flex gap-5 mr-4">
                  <div className="flex gap-2 items-center">
                    <ContributorIcon />
                    <span className="text-sm">{item.contributor_cnt || 0}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MentionIcon />
                    <span className="text-sm">{item.mention_cnt || 0}</span>
                  </div>

                {/* TODO Add download counts to the cards */}
                  {(item?.downloads && item?.downloads > 0) &&
                  <div className="flex gap-2 items-center">
                    <DownloadsIcon />
                    <span className="text-sm">34K</span>
                  </div>
                }
                </div>
              </div>
            </div>
          </Link>
          )
        )}
      </List>
    </section>
  )
}