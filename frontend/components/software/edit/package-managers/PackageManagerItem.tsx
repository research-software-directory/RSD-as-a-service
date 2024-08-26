// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'
import SortableListItem from '~/components/layout/SortableListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

import {PackageManager, packageManagerSettings} from './apiPackageManager'

type PackageManagerItemProps = {
  pos: number,
  item: PackageManager,
  onDelete: (pos:number) => void
  onEdit?: (pos:number) => void
}

type ServiceStatusProps=Readonly<{
  services: string[]
  download_count: number|null,
  download_count_scraped_at: string|null
  reverse_dependency_count: number|null
  reverse_dependency_count_scraped_at: string|null
  download_count_scraping_disabled_reason: string | null,
  reverse_dependency_count_scraping_disabled_reason: string | null,
}>

function RsdScraperStatus({
  services,download_count,
  download_count_scraped_at,
  reverse_dependency_count,
  reverse_dependency_count_scraped_at,
  download_count_scraping_disabled_reason,
  reverse_dependency_count_scraping_disabled_reason
}:ServiceStatusProps){
  const html=[]
  if (services?.length===0) {
    return <span>RSD scraper services not available</span>
  }
  if (services.includes('downloads')){
    if (download_count_scraping_disabled_reason !== null){
      html.push(<span key="downloads" style={{color:'var(--rsd-error)'}}>Downloads: {download_count_scraping_disabled_reason}</span>)
    }else if (download_count_scraped_at && Number.isInteger(download_count)){
      html.push(<span key="downloads">Downloads: {download_count}</span>)
    }else{
      html.push(<span key="downloads">Downloads: no info</span>)
    }
  }
  if (services.includes('dependents')){
    if (reverse_dependency_count_scraping_disabled_reason!==null){
      html.push(
        <span key="dependents" style={{color:'var(--rsd-error)'}}>
          Dependents: DISABLED ({reverse_dependency_count_scraping_disabled_reason})
        </span>
      )
    }else if (reverse_dependency_count_scraped_at && Number.isInteger(reverse_dependency_count)){
      html.push(<span key="dependents">Dependents: {reverse_dependency_count}</span>)
    }else{
      html.push(<span key="dependents">Dependents: no info</span>)
    }
  }
  return html
}

export default function PackageManagerItem({pos, item, onDelete, onEdit}: PackageManagerItemProps) {
  // get package manager info
  const info = packageManagerSettings[item.package_manager ?? 'other']
  const url = new URL(item.url)

  return (
    <SortableListItem
      key={item.id}
      pos={pos}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          variant="square"
          src={info.icon ?? ''}
          sx={{
            width: '4rem',
            height: '4rem',
            '& img': {
              objectFit: 'contain'
            }
          }}
        >
          {url?.hostname?.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={info.name}
        secondary={
          <>
            <span>{item.url}</span><br />
            <RsdScraperStatus
              services={info?.services ?? []}
              // download_count={item.download_count}
              {...item}
            />
          </>
        }
        sx={{
          padding:'0rem 1rem'
        }}
      />
    </SortableListItem>
  )
}
