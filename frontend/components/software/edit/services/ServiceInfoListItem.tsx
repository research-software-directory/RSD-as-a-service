// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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

type ServiceInfoListItemProps={
  title:string
  scraped_at: string|null
  last_error: string|null
  url: string|null
}

export function ServiceInfoListItem({title,scraped_at,last_error,url}:ServiceInfoListItemProps){
  let status:'error'|'success'|'not_active'|'scheduled' = 'not_active'

  // set service status
  if (scraped_at) status='success'
  if (url && !scraped_at) status='scheduled'
  if (last_error) status='error'

  // define icon color
  let color:string=''
  if (status==='error') color='error.main'
  if (status==='success') color='success.main'
  if (status==='not_active') color='warning.main'

  function getStatusIcon(){
    if (status === 'error') return <ErrorIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'success') return <CheckCircleIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'scheduled') return <ScheduleIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'not_active') return <DoDisturbOnIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    return <HelpOutlineIcon sx={{width:'2.5rem',height:'2.5rem'}} />
  }

  function getStatusMsg(){
    if (last_error) return (
      <span className="text-error">{last_error}</span>
    )
    if (scraped_at) {
      const lastRun = new Date(scraped_at)
      return (
        <span className="text-success">{`Last run at ${lastRun.toLocaleString()}`}</span>
      )
    }
    if (url){
      // we have url
      return (
        <span>Scheduled but not yet executed. Check the status again after 30 minutes.</span>
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
    >
      <ListItemAvatar>
        <Avatar
          alt={status}
          sx={{
            width: '2.5rem',
            height: '2.5rem',
            marginRight: '1rem',
            backgroundColor: color ? color : null
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
