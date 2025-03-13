// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
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
import {CodePlatform} from '~/types/SoftwareTypes'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import DeleteIcon from '@mui/icons-material/Delete'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../useSoftwareContext'
import {deleteServiceDataFromDb} from './apiSoftwareServices'


type ServiceInfoListItemProps=Readonly<{
  title:string
  scraped_at: string|null
  last_error: string|null
  url: string|null
  platform: CodePlatform|null
  scraping_disabled_reason: string|null
  dbprops?: string[]
  onClear?:()=>void
}>

export function ServiceInfoListItem({
  title,scraped_at,last_error,url,platform,
  scraping_disabled_reason,dbprops, onClear
}:ServiceInfoListItemProps){
  let status:'error'|'success'|'not_active'|'scheduled'|'not_supported' = 'not_active'
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const {showErrorMessage, showSuccessMessage} = useSnackbar()


  // set service status
  if (scraped_at) status='success'
  if (url && !scraped_at) status='scheduled'
  if (url && (platform==='bitbucket' || platform==='other')) status='not_supported'
  if (last_error) status='error'

  // define icon color
  let color:string=''
  if (status==='error') color='error.main'
  if (status==='success') color='success.main'
  if (status==='not_active') color='warning.main'

  function getStatusIcon(){
    if (scraping_disabled_reason !== null) return <DoDisturbOnIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'error') return <ErrorIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'success') return <CheckCircleIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'scheduled') return <ScheduleIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    if (status === 'not_active') return <DoDisturbOnIcon sx={{width:'2.5rem',height:'2.5rem'}} />
    return <HelpOutlineIcon sx={{width:'2.5rem',height:'2.5rem'}} />
  }

  function getStatusMsg(){
    if (scraping_disabled_reason !== null) {
      return (<span className="text-error">{`DISABLED (${scraping_disabled_reason})`}</span>)
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
      if (status==='not_supported'){
        return (
          <span>Platform not supported (yet).</span>
        )
      }
      return (
        <span>Scheduled, check again after 30 minutes.</span>
      )
    }
    // no URL
    return (
      <span className="text-warning">Not active. Provide repository URL to activate the service.</span>
    )
  }

  async function clearServiceData(dbprops: string[]) {
    const resp = await deleteServiceDataFromDb({dbprops, software: software.id, token: token})
    if (resp?.status === 200) {
      const formattedProps = dbprops
        .map((str, index) => (index === 0 ? str.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()) : str.replace(/_/g, ' ')))
        .join(', ')
      showSuccessMessage(`${formattedProps} cleared from database.`)
      // reload data
      if (onClear) onClear()
    }else{
      showErrorMessage(resp?.message)
    }
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

      { dbprops ?
        <ListItemSecondaryAction>
          <Tooltip title={(status === 'success') ? 'Clear service data' : 'No repository URL or no data to delete.'}>
            <span>
              <IconButton
                onClick={() => {
                  clearServiceData(dbprops)
                }}
                aria-label="delete"
                size="large"
                disabled={status !== 'success'}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </ListItemSecondaryAction>
        : null
      }
    </ListItem>
  )
}
