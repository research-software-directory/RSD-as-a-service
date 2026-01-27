// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ListItemText from '@mui/material/ListItemText'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {PackageManagerTypes} from '~/components/software/edit/package-managers/config'
import {CodePlatform} from './apiRepositories'

type BackgroundServiceListItemProps=Readonly<{
  id?: string | null
  title: string
  scraped_at: string|null
  last_error: string|null
  url: string|null
  platform: CodePlatform | PackageManagerTypes | null
  scraping_disabled_reason?: string|null
  dbprops?: string[]
  iconSize?: string
  onClear: ()=>void
}>

export function BackgroundServiceListItem({
  id,title,scraped_at,last_error,url,platform,
  scraping_disabled_reason,dbprops,iconSize='2.75rem',
  onClear
}:BackgroundServiceListItemProps){

  let status:'error'|'success'|'not_active'|'scheduled'|'not_supported' = 'not_active'

  // set service status
  if (scraped_at) status='success'
  if (url && !scraped_at) status='scheduled'
  if (url && platform==='other') status='not_supported'
  if (last_error) status='error'
  // if disabled this is last status we want to report
  if (scraping_disabled_reason) status='not_active'

  // define icon color
  let color:string=''
  if (status==='error') color='var(--rsd-error,#e53935)'
  if (status==='success') color='var(--rsd-success,#2e7d32)'
  if (status==='not_active') color='var(--rsd-warning,#ed6c02)'

  // console.group('BackgroundServiceListItem')
  // console.log('color...',color)
  // console.log('status...',status)
  // console.groupEnd()

  function getStatusIcon(){
    if (status === 'error') return <ErrorIcon sx={{width:'100%',height:'100%'}} />
    if (status === 'success') return <CheckCircleIcon sx={{width:'100%',height:'100%'}}/>
    if (status === 'scheduled') return <ScheduleIcon sx={{width:'100%',height:'100%'}} />
    if (status === 'not_active') return <DoDisturbOnIcon sx={{width:'100%',height:'100%'}} />
    return <HelpOutlineIcon sx={{width:'100%',height:'100%'}} />
  }

  function getStatusMsg(){
    if (scraping_disabled_reason !== null) {
      return (<span className="text-warning">{`DISABLED (${scraping_disabled_reason})`}</span>)
    }
    if (last_error) return (
      <span className="text-error">{last_error}</span>
    )
    if (scraped_at) {
      const lastRun = new Date(scraped_at)
      return (
        <span className="text-success">{`Last run at ${lastRun.toLocaleString()}`}</span>
      )
    }
    // we have url
    if (url){
      return (
        <span>Scheduled, check again after 30 minutes.</span>
      )
    }
    // no URL
    return (
      <span className="text-warning">Not active. Provide repository URL to activate the service.</span>
    )
  }

  return (
    <ListItem
      data-testid="software-service-item"
      disableGutters={true}
      secondaryAction={
        dbprops && id ?
          <IconButton
            title={(status === 'success') ? 'Clear service data' : 'No repository URL or no data to delete.'}
            onClick={onClear}
            aria-label="delete"
            size="large"
            disabled={status !== 'success'}
          >
            <DeleteIcon />
          </IconButton>
          : null
      }
    >
      <ListItemAvatar>
        <Avatar
          alt={status}
          sx={{
            width: iconSize,
            height: iconSize,
            marginRight: '1rem',
            backgroundColor: color
          }}
        >
          {getStatusIcon()}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={title}
        secondary={getStatusMsg()}
      />
    </ListItem>
  )
}
