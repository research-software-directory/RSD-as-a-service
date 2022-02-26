
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'

import {Contributor} from '../../../../types/Contributor'
import ContributorAvatar from '../../ContributorAvatar'
import {getDisplayInitials, getDisplayName} from '../../../../utils/getDisplayName'
import {Alert, AlertTitle} from '@mui/material'
import {combineRoleAndAffiliation} from '../../../../utils/editContributors'


export default function SoftwareContributorsList({contributors, onEdit, onDelete}:
  {contributors: Contributor[], onEdit:(pos:number)=>void, onDelete:(pos:number)=>void}) {

  function getPrimaryText(item: Contributor) {
    let displayName = getDisplayName(item)
    if (item.is_contact_person) {
      return (
        <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
      )
    }
    return displayName
  }


  function renderList() {
    return contributors.map((item,pos) => {
      const displayName = getDisplayName(item)
      const displayInitials = getDisplayInitials(item)
      return (
        <ListItem
          key={JSON.stringify(item)}
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
            <ListItemText primary={getPrimaryText(item)} secondary={combineRoleAndAffiliation(item)} />
        </ListItem>
      )
    })
  }

  if (contributors.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No contributors</AlertTitle>
        Add contributors using <strong>search form!</strong>
      </Alert>
    )
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}
