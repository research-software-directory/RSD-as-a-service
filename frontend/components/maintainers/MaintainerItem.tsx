// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {getDisplayInitials, splitName} from '~/utils/getDisplayName'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import {MaintainerProps} from './apiMaintainers'

type MaintainerItemProps = {
  pos:number
  maintainer: MaintainerProps
  onDelete: (pos: number) => void
  disableDelete?: boolean
}


export default function MaintainerItem({pos, maintainer, onDelete, disableDelete}: MaintainerItemProps) {
  const {name, email, affiliation} = maintainer
  const displayInitials = getDisplayInitials(splitName(name))
  return (
    <ListItem
      data-testid="maintainer-list-item"
      key={email}
      secondaryAction={
        <>
          <IconButton
            disabled={disableDelete ?? false}
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete(pos)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      sx={{
        // this makes space for buttons
        paddingRight:'6.5rem',
        '&:hover': {
          backgroundColor:'grey.100'
        }
      }}
    >
      <ListItemAvatar>
        <ContributorAvatar
          avatarUrl={''}
          displayName={name ?? ''}
          displayInitials={displayInitials}
        />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={affiliation} />
    </ListItem>
  )
}
