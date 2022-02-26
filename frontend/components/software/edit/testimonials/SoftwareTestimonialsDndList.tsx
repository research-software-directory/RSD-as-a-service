import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import {DropResult} from 'react-beautiful-dnd'

import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

import SoftwareTestimonialListItemDnd from './SoftwareTestimonialsDndListItem'
import {Testimonial} from '../../../../types/Testimonial'

export default function SoftwareTestimonialListDnd({testimonials, onEdit, onDelete, onDragEnd}:
  { testimonials:Testimonial[], onEdit:(pos:number)=>void,
    onDelete:(pos:number)=>void, onDragEnd:({destination, source}: DropResult)=>void}) {

  if (testimonials.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No testimonials</AlertTitle>
        Add one using <strong>ADD button!</strong>
      </Alert>
    )
  }

  function renderList() {
    return testimonials.map((item, index) => {
      item.position = index + 1
      return (
        <SoftwareTestimonialListItemDnd
          key={JSON.stringify(item)}
          item={item}
          index={index}
          secondaryAction={
            <>
              <IconButton
                edge="end"
                aria-label="edit"
                sx={{marginRight: '1rem'}}
                onClick={() => {
                  onEdit(index)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  onDelete(index)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
        />
      )
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {provided => (
          <List
            ref={provided.innerRef}
            sx={{
              width: '100%',
            }}
            {...provided.droppableProps}
          >
            {renderList()}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}
