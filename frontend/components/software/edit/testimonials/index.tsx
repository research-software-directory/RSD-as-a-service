// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {useSession} from '~/auth'
import useSnackbar from '../../../snackbar/useSnackbar'
import {NewTestimonial, Testimonial} from '../../../../types/Testimonial'
import {
  postTestimonial, patchTestimonial,
  deleteTestimonialById, patchTestimonialPositions
} from '../../../../utils/editTestimonial'
import {sortOnNumProp} from '../../../../utils/sortFn'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'

import EditTestimonialModal from './EditTestimonialModal'
import EditSoftwareSection from '../../../layout/EditSection'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {ModalProps,ModalStates} from '../editSoftwareTypes'

import SortableTestimonialList from './SortableTestimonialList'
import useTestimonals from './useTestimonials'


type EditTestimonialModal = ModalProps & {
  testimonial?: NewTestimonial | Testimonial
}

export default function SoftwareTestimonials() {
  const {token} = useSession()
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const {loading,software,testimonials,setTestimonials} = useTestimonals()
  const [modal, setModal] = useState<ModalStates<EditTestimonialModal>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    }
  })

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

  function loadTestimonialIntoModal(testimonial:NewTestimonial|Testimonial,pos?:number) {
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
    const testimonial = testimonials[pos]
    // update position if null
    if (!testimonial.position) {
      // this is current position in the list
      testimonial.position = pos + 1
    }
    loadTestimonialIntoModal(testimonial,pos)
  }

  async function onSubmitTestimonial({data,pos}:{data:Testimonial|NewTestimonial,pos?:number}) {
    // debugger
    closeModals()
    // if id present we update
    if (data?.id) {
      const resp = await patchTestimonial({testimonial: data as Testimonial, token})
      // debugger
      if (resp.status === 200) {
        updateTestimonialList({data:data as Testimonial,pos})
      } else {
        showErrorMessage(`Failed to update testimonial. Error: ${resp.message}`)
      }
    } else {
      // new testimonial
      const resp = await postTestimonial({testimonial: data as NewTestimonial, token})
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
    const displayName = `${testimonials[pos].source}`
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
      const resp = await deleteTestimonialById({id: testimonial?.id ?? '', token})
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

  function onSorted(items: Testimonial[]) {
    // set updated items
    patchPositions(items)
    setTestimonials(items)
  }

  /**
   * We patch the position prop of items.
   * @param data
   */
  async function patchPositions(data:Testimonial[]) {
    const resp = await patchTestimonialPositions({testimonials:data, token})
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update testimonial positions! Error: ${resp.message}`)
    }
  }

  function getTestimonialSubtitle() {
    if (testimonials?.length === 1) {
      return `${software?.brand_name} has 1 testimonial`
    }
    return `${software?.brand_name} has ${testimonials?.length} testimonials`
  }

  return (
    <section className="flex-1">
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title="Testimonials"
            subtitle={getTestimonialSubtitle()}
          >
            <Button
              data-testid="add-testimonial-btn"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              Add
            </Button>
          </EditSectionTitle>
          <SortableTestimonialList
            items={testimonials}
            onEdit={onEdit}
            onDelete={onDelete}
            onSorted={onSorted}
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
          <p>Are you sure you want to remove testimonial from source <strong>{modal.delete.displayName ?? ''}</strong>?</p>
        }
        onCancel={closeModals}
        onDelete={()=>deleteTestimonial(modal.delete.pos)}
      />
    </section>
  )
}
