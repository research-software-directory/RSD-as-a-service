// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'

import {maxText} from '~/utils/maxText'
import {OrganisationStatus} from '~/types/Organisation'

type SoftwareItem = {
  id: string
  slug: string
  brand_name: string
  short_statement: string
  status: OrganisationStatus
}

type SoftwareListProps = {
  software: SoftwareItem[] | undefined
  onRemove:(pos:number)=>void
}

type SoftwareItemProps = {
  software: SoftwareItem
  onDelete:()=>void
}

// list item & alert height
const itemHeight='6rem'

export default function RelatedSoftwareList({software,onRemove}:SoftwareListProps) {
  if (typeof software == 'undefined') return null
  if (software.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem',height:itemHeight}}>
        <AlertTitle sx={{fontWeight:500}}>No related software items</AlertTitle>
        Add related software using <strong>search form!</strong>
      </Alert>
    )
  }

  function renderList() {
    if (typeof software == 'undefined') return null
    return software.map((item,pos) => {
      return (
        <RelatedSoftwareItem
          key={item.slug}
          software={item}
          onDelete={()=>onRemove(pos)}
        />
      )
    })
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}

export function RelatedSoftwareItem({software,onDelete}:SoftwareItemProps) {
  function getStatusIcon() {
    if (software.status !== 'approved') {
      return (
        <div
          title="Waiting on approval"
          className="absolute flex items-center w-[2rem] h-[4rem] bg-primary"
        >
          <LockIcon
            sx={{
              width: '2rem',
              height: '2rem',
              color: 'white'
            }}
          />
        </div>
      )
    }
    return null
  }
  return (
    <ListItem
      data-testid="related-software-item"
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={onDelete}
          sx={{marginRight: '0rem'}}
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{
        minHeight:itemHeight,
        // this makes space for buttons
        paddingRight:'5rem',
        // '&:hover': {
        //   backgroundColor:'grey.100'
        // }
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={software.brand_name ?? ''}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {software?.brand_name.slice(0,2).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      {getStatusIcon()}
      <ListItemText
        primary={
          <a href={`/software/${software.slug}`} target="_blank" rel="noreferrer">
            {software.brand_name}
          </a>
        }
        secondary={maxText({
          text: software.short_statement ?? ''
        })}
      />
    </ListItem>
  )
}
