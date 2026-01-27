// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {testimonialInformation as config} from '../editSoftwareConfig'
import {ModalProps,ModalStates} from '../editSoftwareTypes'
import EditTestimonialModal from './EditTestimonialModal'
import SortableTestimonialList from './SortableTestimonialList'
import useTestimonals from './useSoftwareTestimonials'
import AddButton from '~/components/layout/AddButton'

type EditTestimonialModal = ModalProps & {
  testimonial?: NewTestimonial | Testimonial
}

export default function SoftwareTestimonials() {
  const {
    loading,software,testimonials,
    addTestimonial,updateTestimonial,
    sortedTestimonials,deleteTestimonial
  } = useTestimonals()

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

  // console.group("SoftwareTestimonials")
  // console.log('testimonials...', testimonials)
  // console.log("loading...", loading)
  // console.groupEnd()

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
    closeModals()
    if (data?.id === null) {
      // new testimonial
      addTestimonial(data)
    } else if (typeof pos === 'number') {
      // if id present we update
      updateTestimonial({data: data as Testimonial, pos})
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

  function getTestimonialSubtitle() {
    if (testimonials?.length === 1) {
      return `${software?.brand_name} has 1 testimonial`
    }
    return `${software?.brand_name} has ${testimonials?.length} testimonials`
  }

  return (
    <section className="flex-1">
      <EditSection>
        <div className="py-4">
          <EditSectionTitle
            title="Testimonials"
            subtitle={getTestimonialSubtitle()}
          >
            <AddButton onAdd={onAdd} />
            {/* <Button
              variant='contained'
              data-testid="add-testimonial-btn"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              Add
            </Button> */}
          </EditSectionTitle>
          <SortableTestimonialList
            items={testimonials}
            onEdit={onEdit}
            onDelete={onDelete}
            onSorted={sortedTestimonials}
          />
        </div>
      </EditSection>

      {
        modal.edit.open ?
          <EditTestimonialModal
            config={config}
            open={modal.edit.open}
            pos={modal.edit.pos}
            testimonial={modal.edit.testimonial}
            onCancel={closeModals}
            onSubmit={onSubmitTestimonial}
          />
          : null
      }

      {modal.delete.open ?
        <ConfirmDeleteModal
          title="Remove testimonial"
          open={modal.delete.open}
          body={
            <p>Are you sure you want to remove testimonial from source <strong>{modal.delete.displayName ?? ''}</strong>?</p>
          }
          onCancel={closeModals}
          onDelete={()=> {
            if (typeof modal.delete.pos === 'number'){
              deleteTestimonial(modal.delete.pos)
            }
            closeModals()
          }}
        />
        : null
      }
    </section>
  )
}
