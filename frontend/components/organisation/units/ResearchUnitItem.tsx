import Link from 'next/link'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import {OrganisationForOverview} from '../../../types/Organisation'
import {getUrlFromLogoId} from '../../../utils/editOrganisation'

type UnitListItemProps = {
  rsdPath: string
  organisation: OrganisationForOverview
  pos: number
  onEdit: (pos:number)=>void
  onDelete: (pos: number) => void
  isMaintainer: boolean
}

export default function UnitItem({rsdPath,organisation, pos, onEdit, onDelete, isMaintainer}: UnitListItemProps) {

  const rsdUrl = `${rsdPath}/${organisation.slug}`

  function getSecondaryActions() {
    if (isMaintainer) {
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
          {/*
          DELETE requires cleaning multiple tables
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete(pos)
            }}
            sx={{marginRight: '0rem'}}
          >
            <DeleteIcon />
          </IconButton> */}
        </>
      )
    }
  }

  function getSecondaryLabel(){
    if (organisation.website) {
      return (
        <>
          <span>
            <a href={organisation.website} target="_blank" rel="noreferrer">{organisation.website}</a>
          </span>
        </>
      )
    }
    return null
  }

  return (
     <ListItem
        key={JSON.stringify(organisation)}
        secondaryAction={getSecondaryActions()}
        sx={{
          // this makes space for buttons
          paddingRight:'7.5rem',
          '&:hover': {
            backgroundColor:'grey.100'
          }
        }}
    >
      <ListItemAvatar>
        {/* <a href={rsdUrl}> */}
        <Link href={rsdUrl}>
          <Avatar
            alt={organisation.name ?? ''}
            src={getUrlFromLogoId(organisation.logo_id) ?? ''}
            sx={{
              width: '4rem',
              height: '4rem',
              fontSize: '1.5rem',
              marginRight: '1rem',
              '& img': {
                height:'auto'
              }
            }}
            variant="square"
          >
            {organisation.name.slice(0,3)}
          </Avatar>
        </Link>
        {/* </a> */}
      </ListItemAvatar>
      <ListItemText
        primary={
          <a href={rsdUrl}>
            {organisation.name}
          </a>
        }
        secondary={getSecondaryLabel()}
        />
      </ListItem>
  )
}
