import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import {EditOrganisation} from '../../../../types/Organisation'
import {getUrlFromLogoId} from '../../../../utils/editOrganisation'

type OrganisationsListItemProps = {
  organisation: EditOrganisation
  pos: number
  onEdit: (pos:number)=>void
  onDelete: (pos:number)=>void
}

export default function OrganisationsItem({organisation, pos, onEdit, onDelete}: OrganisationsListItemProps) {

  function getSecondaryActions() {
    if (organisation.canEdit) {
      return (
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            onClick={() => {
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
      )
    }
    return (
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => {
          onDelete(pos)
        }}
      >
        <DeleteIcon />
      </IconButton>
    )
  }

  return (
     <ListItem
        key={JSON.stringify(organisation)}
        secondaryAction={getSecondaryActions()}
        sx={{
          // this makes space for buttons
          paddingRight:'6.5rem',
          '&:hover': {
            backgroundColor:'grey.100'
          }
        }}
        >
      <ListItemAvatar>
        <Avatar
          alt={organisation.name ?? ''}
          src={getUrlFromLogoId(organisation.logo_id) ?? ''}
          sx={{
            width: '6rem',
            height: '6rem',
            fontSize: '3rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {organisation.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={organisation.name}
        secondary={organisation.website}
      />
    </ListItem>
  )
}
