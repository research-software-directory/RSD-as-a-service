// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import {Alert, AlertTitle} from '@mui/material'

import {TeamMember} from '~/types/Project'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import {combineRoleAndAffiliation, getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'

type TeamMemberProps = {
  pos: number,
  item: TeamMember,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}

type TeamMemberListProps = {
  members: TeamMember[],
  onEdit: (member: TeamMember, pos: number) => void
  onDelete: (pos:number) => void
}

export default function TeamMemberList({members, onEdit, onDelete}: TeamMemberListProps) {

  // show message when no members
  if (members.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No team members</AlertTitle>
        Add team member using <strong>search form!</strong>
      </Alert>
    )
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {members.map((item, pos) => {
        return (
          <TeamMemberItem
            key={item.id ?? pos}
            pos={pos}
            item={item}
            onEdit={() => {
              onEdit(members[pos], pos)
            }}
            onDelete={()=>onDelete(pos)}
          />
        )
      })}
    </List>
  )
}

function TeamMemberItem({pos, item, onEdit, onDelete}: TeamMemberProps) {
  const displayName = getDisplayName(item)
  const displayInitials = getDisplayInitials(item)
  const primaryText = item.is_contact_person ?
    <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
    : displayName

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            onClick={() => {
              // alert(`Edit...${item.id}`)
              onEdit(pos)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
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
            avatarUrl={item.avatar_url ?? ''}
            displayName={displayName ?? ''}
            displayInitials={displayInitials}
          />
        </ListItemAvatar>
        <ListItemText primary={primaryText} secondary={combineRoleAndAffiliation(item)} />
    </ListItem>
  )
}
