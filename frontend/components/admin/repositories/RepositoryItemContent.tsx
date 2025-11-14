// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'
import RepositoryIcon from '~/components/software/edit/repositories/RepositoryIcon'

type RepositoryItemContentProps=Readonly<{
  item: RepositoryUrl
}>


function RepositoryInfo({item}:RepositoryItemContentProps){
  // if disabled we show that
  if (item.scraping_disabled_reason){
    return (
      <span className="text-error">Scraping disabled: {item.scraping_disabled_reason}</span>
    )
  }
  //  if archived we return that info
  if (item.archived){
    return <span className="text-warning uppercase text-sm">ARCHIVED</span>
  }

  if (item.basic_data_scraped_at){
    return <span>Last scraped at: {item.basic_data_scraped_at}</span>
  }

  return <span>Platform: {item.code_platform}</span>
}


export default function RepositoryItemContent({item}:RepositoryItemContentProps) {
  return (
    <>
      <ListItemAvatar sx={{padding:'0.75rem 0.75rem 0.75rem 0rem'}}>
        <RepositoryIcon platform={item.code_platform} />
      </ListItemAvatar>
      <ListItemText
        primary={item.url}
        secondary={
          <RepositoryInfo item={item} />
        }
      />
    </>
  )
}
