// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {MaintainerOfProject} from './useProjectMaintainer'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import {getDisplayInitials, splitName} from '~/utils/getDisplayName'

type ProjectMaintainerProps = {
  pos:number
  maintainer: MaintainerOfProject
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
  disableDelete?: boolean
}


export default function ProjectMaintainer({pos, maintainer, onEdit, onDelete, disableDelete}: ProjectMaintainerProps) {
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
