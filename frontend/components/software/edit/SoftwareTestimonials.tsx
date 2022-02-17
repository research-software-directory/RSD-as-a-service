import {useContext, useEffect, useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import {Button} from '@mui/material'

import snackbarContext,{snackbarDefaults} from '../../snackbar/PageSnackbarContext'
import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'
import {Testimonial} from '../../../types/Testimonial'
import {
  postTestimonial, getTestimonialsForSoftware,
  patchTestimonial, deleteTestimonialById
} from '../../../utils/editTestimonial'
import EditTestimonialModal from './EditTestimonialModal'
import ContentLoader from '../../layout/ContentLoader'
import {sortOnNumProp} from '../../../utils/sortFn'
import ConfirmDeleteModal from '../../layout/ConfirmDeleteModal'

import SoftwareTestimonialsDndList from './SoftwareTestimonialsDndList'
import {DropResult} from 'react-beautiful-dnd'
import {reorderList} from '../../../utils/dndHelpers'

type ModalProps = {
  open: boolean
  pos?: number
}

type EditModalProps = ModalProps & {
  testimonial?: Testimonial
}

type DeleteModalProps = ModalProps & {
  displayName?: string
}

type ModalStates = {
  edit: EditModalProps,
  delete: DeleteModalProps
}

export default function SoftwareTestimonials({token}: {token: string }) {
  const {setSnackbar} = useContext(snackbarContext)
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalStates>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })
  useEffect(() => {
    let abort = false
    const getTestimonials = async (software:string,token:string) => {
      const resp = await getTestimonialsForSoftware({
        software,
        token,
        frontend:true
      })
      if (abort) return
      // update state
      setTestimonials(resp ?? [])
      setLoading(false)
    }
    if (software?.id && token) {
      getTestimonials(software.id,token)
    }

    return () => { abort = true }
  },[software?.id,token])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function updateTestimonialList({data, pos}: { data: Testimonial, pos?: number }) {
    if (typeof pos == 'number') {
      // REPLACE existing item and sort
      const list = [
        ...testimonials.slice(0, pos),
        data,
        ...testimonials.slice(pos+1)
      ].sort((a,b)=>sortOnNumProp(a,b,'position'))
      // pass new list with addition contributor
      setTestimonials(list)
    } else {
      // ADD item and sort
      const list = [
        ...testimonials,
        data
      ].sort((a,b)=>sortOnNumProp(a,b,'position'))
      setTestimonials(list)
    }
  }

  function loadTestimonialIntoModal(testimonial:Testimonial,pos?:number) {
    setModal({
      edit: {
        open: true,
        testimonial,
        pos
      },
      delete: {
        open:false
      }
    })
  }

  function closeModals() {
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
  }

  function showSuccessMessage(message: string) {
    // show notification
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity: 'success',
      duration: 5000,
      message
    })
  }

  function showErrorMessage(message: string) {
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity: 'error',
      duration: undefined,
      message,
    })
  }

  function onAdd() {
    // console.log('Add new testimonial')
    loadTestimonialIntoModal({
      id: null,
      software: software?.id ?? '',
      message: null,
      source: null,
      position: testimonials.length + 1
    })
  }

  function onEdit(pos: number){
    // console.log('edit testimonial at ...', pos)
    const testimonial = testimonials[pos]
    // update position if null
    if (!testimonial.position) {
      // this is current position in the list
      testimonial.position = pos + 1
    }
    loadTestimonialIntoModal(testimonial,pos)
  }

  async function onSubmitTestimonial({data,pos}:{data:Testimonial,pos?:number}) {
    // debugger
    closeModals()
    // if id present we update
    if (data?.id) {
      const resp = await patchTestimonial({testimonial: data, token})
      // debugger
      if (resp.status === 200) {
        updateTestimonialList({data,pos})
      } else {
        showErrorMessage(`Failed to update testimonial. Error: ${resp.message}`)
      }
    } else {
      // new testimonial
      const resp = await postTestimonial({testimonial: data, token})
      // debugger
      if (resp.status === 201) {
        // we receive processed item as message
        const record = resp.message
        updateTestimonialList({data: record, pos})
        showSuccessMessage(`Created new testimonial for ${software.brand_name}!`)
      } else {
        showErrorMessage(`Failed to add testimonial. Error: ${resp.message}`)
      }
    }
  }

  function onDelete(pos: number) {
    const displayName = `testimonial from ${testimonials[pos].source}`
    setModal({
      edit: {
        open: false
      },
      delete: {
        open: true,
        pos,
        displayName
      }
    })
  }

  async function deleteTestimonial(pos?:number) {
    if (!pos) return
    closeModals()
    // debugger
    const testimonial = testimonials[pos]
    if (testimonial?.id) {
      const resp = await deleteTestimonialById({id: testimonial?.id, token})
      // debugger
      if (resp.status === 200) {
        // showSuccessMessage("Removed teste")
        removeFromTestimonialList(pos)
      } else {
        showErrorMessage(`Failed to remove testimonial! Error: ${resp.message}`)
      }
    }
  }

  function removeFromTestimonialList(pos: number) {
    // remove item from the list
    const list = [
      ...testimonials.slice(0, pos),
      ...testimonials.slice(pos+1)
    ]
    setTestimonials(list)
  }

  function onDragEnd({destination, source}: DropResult){
    // dropped outside the list
    if (!destination) return
    // console.group('onDragEnd')
    // console.log('destination...',destination)
    // console.log('source...', source)
    // console.groupEnd()
    // debugger
    const newItems = reorderList({
      list:testimonials,
      startIndex:source.index,
      endIndex:destination.index
    }).map((item,pos)=>{
      // renumber
      item.position=pos+1
      return item
    })
    // debugger
    setTestimonials(newItems)
  }

  return (
    <section className="flex-1">
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title={'Testimonials'}
            subtitle={testimonials?.length > 0 ? `You have ${testimonials?.length} testimonials` : ''}
          >
            <Button
              // variant='contained'
              startIcon={<AddIcon />}
              // endIcon={<AddIcon />}
              // sx={{
              //   marginRight: '2rem'
              // }}
              onClick={onAdd}
            >
              Add
            </Button>
          </EditSectionTitle>
          <SoftwareTestimonialsDndList
            testimonials={testimonials}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragEnd={onDragEnd}
          />
        </div>
      </EditSoftwareSection>
      <EditTestimonialModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        testimonial={modal.edit.testimonial}
        onCancel={closeModals}
        onSubmit={onSubmitTestimonial}
      />
      <ConfirmDeleteModal
        title="Remove testimonial"
        open={modal.delete.open}
        displayName={modal.delete.displayName ?? ''}
        onCancel={closeModals}
        onDelete={()=>deleteTestimonial(modal.delete.pos)}
      />
    </section>
  )
}
