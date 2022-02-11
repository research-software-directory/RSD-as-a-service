
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import {Contributor} from '../../../types/Contributor'
import ContributorAvatar from '../ContributorAvatar'

import {getDisplayInitials, getDisplayName} from '../../../utils/getDisplayName'

export default function SoftwareContributorsList({contributors, onEdit, onDelete}:
  {contributors: Contributor[], onEdit:(pos:number)=>void, onDelete:(pos:number)=>void}) {

  function getPrimaryText(item: Contributor) {
    let displayName = getDisplayName(item)
    if (item.is_contact_person) {
      // displayName += ' (contact person)'
      return (
        <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
      )
    }
    return displayName
  }

  function getSecondaryText(item:Contributor) {
    if (item?.affiliation) {
      return item?.affiliation
    }
    return 'Affiliation unknown'
  }

  function renderList() {
    return contributors.map((item,pos) => {
      const displayName = getDisplayName(item)
      const displayInitials = getDisplayInitials(item)
      const affiliation = getSecondaryText(item)
      return (
        // <ListItemButton
        //   key={item.id}
        //   onClick={(e) => {
        //     console.log(`Edit ${item.id}`)
        //     onEdit(pos)
        //   }}
        // >
        <ListItem
            key={item.id}
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
                    // alert(`Delete...${item.id}`)
                    onDelete(pos)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          sx={{
            '&:hover': {
              backgroundColor:'#eee'
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
            <ListItemText primary={getPrimaryText(item)} secondary={affiliation} />
          </ListItem>
        // </ListItemButton>
      )
    })
  }

  return (
    <List sx={{
      width: '100%',
      // maxWidth: '30rem',
      // bgcolor: 'background.paper'
    }}>
      {renderList()}
    </List>
  )
}
