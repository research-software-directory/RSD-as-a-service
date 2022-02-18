import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'

import {Testimonial} from '../../../types/Testimonial'

export default function SoftwareTestimonialList({testimonials, onEdit, onDelete}:
  { testimonials:Testimonial[], onEdit:(pos:number)=>void, onDelete:(pos:number)=>void}) {

  if (testimonials.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No testimonials</AlertTitle>
        Add one using <strong>ADD button!</strong>
      </Alert>
    )
  }

  function renderList() {
    return testimonials.map((item, n) => {
      const pos = n + 1
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
                  onEdit(n)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  onDelete(n)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
          sx={{
            // this makes space for buttons
            paddingRight:'8rem',
            '&:hover': {
              backgroundColor:'grey.100'
            }
          }}
          >
            <ListItemAvatar>
              <span className='text-[3rem]'>{item?.position}</span>
            </ListItemAvatar>
            <ListItemText
              primary={item?.message}
              secondary={
                <span>- {item?.source}</span>
              }
            />
        </ListItem>
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
