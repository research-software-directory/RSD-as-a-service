import {useContext, useEffect, useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {useForm} from 'react-hook-form'
import {DropResult} from 'react-beautiful-dnd'

import useSnackbar from '../../../snackbar/useSnackbar'
import {Testimonial} from '../../../../types/Testimonial'
import {
  postTestimonial, getTestimonialsForSoftware,
  patchTestimonial, deleteTestimonialById, patchTestimonialPositions
} from '../../../../utils/editTestimonial'
import {reorderList} from '../../../../utils/dndHelpers'
import {sortOnNumProp} from '../../../../utils/sortFn'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'

import EditTestimonialModal from './EditTestimonialModal'
import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext, {EditSoftwareActionType} from '../editSoftwareContext'
import EditSectionTitle from '../EditSectionTitle'
import SoftwareTestimonialsDndList from './SoftwareTestimonialsDndList'
import {ModalProps,ModalStates} from '../editSoftwareTypes'

type EditTestimonialModal = ModalProps & {
  testimonial?: Testimonial
}

export default function SoftwareTestimonials({token}: {token: string }) {
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalStates<EditTestimonialModal>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    }
  })

  // destructure methods from react-hook-form
  const {handleSubmit, reset, control} = useForm<{update:boolean}>({
    mode: 'onChange',
    defaultValues: {
      update:false
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
    if (typeof pos=='undefined') return
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
    ].map((item,pos) => {
      item.position = pos + 1
      return item
    })

    // update list
    setTestimonials(list)
    // save new positions to db
    if (list.length > 0) patchPositions(list)
  }

  function onDragEnd({destination, source}: DropResult){
    // dropped outside the list
    if (!destination) return
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
    // position changed
    if (source.index !== destination.index) {
      dispatchPageState({
        type: EditSoftwareActionType.UPDATE_STATE,
        payload: {
          isDirty:true,
          isValid:true,
        }
      })
    }
  }

  /**
   * We patch the position prop of items.
   * @param data
   */
  async function patchPositions(data:Testimonial[]) {
    const resp = await patchTestimonialPositions({testimonials:data, token})
    if (resp.status === 200) {
      // after we patched all items
      dispatchPageState({
        type: EditSoftwareActionType.UPDATE_STATE,
        payload: {
          isDirty:false,
          isValid:true,
        }
      })
    } else {
      showErrorMessage(`Failed to update testimonial positions! Error: ${resp.message}`)
    }
  }

  /**
   * This fn is called by "dummy" form which is
   * linked to Save button at the header of the page
   */
  function patchSubmit() {
    patchPositions(testimonials)
  }

  function getTestimonialSubtitle() {
    if (testimonials?.length === 1) {
      return `${software?.brand_name} has 1 testimonial`
    }
    return `${software?.brand_name} has ${testimonials?.length} testimonials`
  }

  return (
    <section className="flex-1">
      <form
        id={pageState.step?.formId}
        onSubmit={handleSubmit(patchSubmit)}>
        {/*
          This form is used to enable Save button in the header
          and trigger saving item positions when drag-and-drop
          <input type="hidden" {...register('update') } />
        */}
      </form>
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title="Testimonials"
            subtitle={getTestimonialSubtitle()}
          >
            <Button
              startIcon={<AddIcon />}
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
        body={
          <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? ''}</strong>?</p>
        }
        onCancel={closeModals}
        onDelete={()=>deleteTestimonial(modal.delete.pos)}
      />
    </section>
  )
}
