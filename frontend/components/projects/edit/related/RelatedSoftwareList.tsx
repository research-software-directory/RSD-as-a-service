import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {RelatedSoftware} from '~/types/SoftwareTypes'
import {maxText} from '~/utils/maxText'

type SoftwareListProps = {
  software: RelatedSoftware[] | undefined
  onRemove:(pos:number)=>void
}

type SoftwareItemProps = {
  software: RelatedSoftware
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
          key={pos}
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

  return (
     <ListItem
        secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={onDelete}
            sx={{marginRight: '0rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
        }
        sx={{
          height:itemHeight,
          // this makes space for buttons
          paddingRight:'5rem',
          '&:hover': {
            backgroundColor:'grey.100'
          }
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
