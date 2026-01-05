// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useProjectContext from '../context/useProjectContext'
import {addProjectTestimonial, deleteProjectTestimonial,
  getTestimonialsForProject, patchTestimonialPositions,
  updateProjectTestimonial
} from './apiProjectTestimonial'
import {sortOnNumProp} from '~/utils/sortFn'

export default function useProjectTestimonial(){
  const {token} = useSession()
  const {project} = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const {showErrorMessage} = useSnackbar()

  const getTestimonials = useCallback(async()=>{
    if (project.id && token){
      const testimonials = await getTestimonialsForProject({
        project: project.id,
        token
      })
      setTestimonials(testimonials)
      setLoading(false)
    }
  },[project.id,token])

  const addTestimonial = useCallback(async(item:NewTestimonial)=>{
    if (project.id && token){
      const resp = await addProjectTestimonial({
        testimonial:{
          ...item,
          project: project.id
        },
        token
      })
      if (resp.status!==201){
        showErrorMessage(`Failed to add testimonial. ${resp.message}`)
      }else{
        // add new item
        setTestimonials((data)=>{
          return [
            ...data,
            resp.message
          ]
        })
      }
    }
  // ignore showErrorMessage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,project.id])

  const updateTestimonial = useCallback(async({data, pos}: {data: Testimonial, pos: number})=>{
    if (project.id && token && data.id){
      const testimonial = {
        ...data,
        project: project.id
      }
      const resp = await updateProjectTestimonial({
        data:testimonial,
        token
      })
      if (resp.status==200){
        setTestimonials((testimonials)=>{
          // replace item in state
          const list = [
            ...testimonials.slice(0, pos),
            testimonial,
            ...testimonials.slice(pos+1)
          ].sort((a,b)=>sortOnNumProp(a,b,'position'))
          return list
        })
      }else{
        showErrorMessage(`Failed to update testimonial. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,project.id])

  const deleteTestimonial = useCallback(async(id:string)=>{
    if (token && id){
      const resp = await deleteProjectTestimonial({
        id,
        token
      })
      if (resp.status===200){
        // remove item from the list
        const list = testimonials
          .filter(item=>item.id!==id)
          .map((item,pos) => {
            item.position = pos + 1
            return item
          })
        // patch testimonials position
        await updateTestimonialPosition(list)
      }else{
        showErrorMessage(`Failed to delete testimonial. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,testimonials])

  const updateTestimonialPosition = useCallback(async(newList: Testimonial[])=>{
    // update ui first
    setTestimonials(newList)

    // update db
    const resp = await patchTestimonialPositions({
      testimonials: newList,
      token
    })

    if (resp.status!==200){
      // revert back
      setTestimonials(testimonials)
      showErrorMessage(`Failed to update positions. ${resp.message}`)
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,testimonials])


  useEffect(()=>{
    if (project.id && token){
      getTestimonials()
    }
  },[project.id,token,getTestimonials])

  return {
    loading,
    testimonials,
    project,
    addTestimonial,
    updateTestimonial,
    updateTestimonialPosition,
    deleteTestimonial
  }
}
