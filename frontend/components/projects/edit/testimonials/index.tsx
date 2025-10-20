// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import SortableTestimonialList from '~/components/software/edit/testimonials/SortableTestimonialList'
import EditTestimonialModal from '~/components/software/edit/testimonials/EditTestimonialModal'
import {ModalProps} from '~/components/software/edit/editSoftwareTypes'
import {NewProjectTestimonial,ProjectTestimonial} from './apiProjectTestimonial'
import useProjectTestimonial from './useProjectTestimonial'
import config from './config'

type EditTestimonialModal = ModalProps & {
  testimonial?: NewProjectTestimonial | ProjectTestimonial
}

export default function ProjectTestimonials() {
  const {
    loading, testimonials, project,
    addTestimonial, updateTestimonial,
    deleteTestimonial,updateTestimonialPosition
  } = useProjectTestimonial()

  const [modal,setModal] = useState<{
    edit:{
      open:boolean,
      pos?: number,
    },
    delete:{
      open:boolean
    },
    testimonial?: NewTestimonial | Testimonial
  }>({
    edit:{
      open:false,
      pos: 0
    },
    delete:{
      open:false,
    }
  })

  // console.group("ProjectTestimonials")
  // console.log('testimonials...', testimonials)
  // console.log("loading...", loading)
  // console.groupEnd()

  function onAdd(){
    setModal({
      edit:{
        open: true,
      },
      delete:{
        open: false
      },
      testimonial:{
        id: null,
        message: null,
        source: null,
        position: testimonials.length + 1
      }
    })
  }

  function onEdit(pos:number){
    setModal({
      edit:{
        open: true,
        pos
      },
      delete:{
        open:false
      },
      testimonial: testimonials[pos]
    })
  }

  function onDelete(pos:number){
    setModal({
      edit:{
        open: false,
        pos
      },
      delete:{
        open:true
      },
      testimonial: testimonials[pos]
    })
  }

  function onSubmit({data,pos}:{data:Testimonial|NewTestimonial,pos?:number}){
    closeModals()

    if (data.id === null){
      // create new item
      addTestimonial(data)
    }else if (typeof pos === 'number'){
      // update item
      updateTestimonial({data: data as Testimonial, pos})
    }
  }

  function getTestimonialSubtitle() {
    if (testimonials?.length === 1) {
      return `${project?.title} has 1 testimonial`
    }
    return `${project?.title} has ${testimonials?.length} testimonials`
  }

  function closeModals(){
    setModal({
      edit:{
        open: false,
        pos: 0
      },
      delete:{
        open: false
      }
    })
  }

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  return (
    <section className="flex-1">
      <EditSection>
        <div className="py-4">
          <EditSectionTitle
            title="Testimonials"
            subtitle={getTestimonialSubtitle()}
          >
            <Button
              variant='contained'
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
            onSorted={updateTestimonialPosition}
          />
        </div>
      </EditSection>
      {modal.edit.open ?
        <EditTestimonialModal
          config={config}
          open={modal.edit.open}
          pos={modal.edit.pos}
          testimonial={modal.testimonial}
          onCancel={closeModals}
          onSubmit={onSubmit}
        />
        : null
      }
      {modal.delete.open ?
        <ConfirmDeleteModal
          title="Remove testimonial"
          open={modal.delete.open}
          body={
            <p>Are you sure you want to remove testimonial from source <strong>{modal?.testimonial?.source ?? ''}</strong>?</p>
          }
          onCancel={closeModals}
          onDelete={()=>{
            if (modal?.testimonial?.id){
              deleteTestimonial(modal?.testimonial?.id)
            }
            closeModals()
          }}
        />
        : null
      }
    </section>
  )
}
