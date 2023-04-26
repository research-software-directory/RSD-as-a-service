// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'

import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import ContributorIcon from '~/components/icons/ContributorIcon'
import MentionIcon from '~/components/icons/MentionIcon'
import DownloadsIcon from '~/components/icons/DownloadsIcon'

export default function SoftwareOverviewList({software = []}: { software: SoftwareListItem[] }) {
  const size = 3

  return (
    <section className="flex-1 mt-2">
      <List>
        {software.map(item => {
          return (
            <Link
              key={item.id}
              href={`/software/${item.slug}`}
              className="hover:text-inherit"
            >
              <ListItem
                key={item.id}
                sx={{
                  margin: '0rem 0rem 0.5rem 0rem',
                  backgroundColor: 'background.paper',
                  borderRadius: '0.25rem',
                  // this makes space for buttons
                  paddingRight:'7rem',
                }}
                secondaryAction={
                  <div className="flex gap-5">
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
                }
              >
                {item.image_id &&
                  <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        alt={item.brand_name}
                        src={getImageUrl(item.image_id) ?? ''}
                        sx={{
                          width: `${size}rem`,
                          height: `${size}rem`,
                          fontSize: `${size / 3}rem`,
                          marginRight: '1rem'
                        }}
                      >
                        {item.brand_name}
                      </Avatar>
                  </ListItemAvatar>
                }
                <ListItemText
                  primary={item.brand_name}
                  secondary={item.short_statement}
                />
              </ListItem>
            </Link>
          )
        })}
      </List>
    </section>
  )
}
