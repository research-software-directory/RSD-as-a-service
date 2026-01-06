// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {sortOnNumProp} from '~/utils/sortFn'
import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../context/useSoftwareContext'
import {
  deleteTestimonialById, getTestimonialsForSoftware,
  patchTestimonial, patchTestimonialPositions,
  postTestimonial
} from './apiSoftwareTestimonial'


export default function useSoftwareTestimonals() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const {showErrorMessage} = useSnackbar()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedSoftware, setLoadedSoftware] = useState('')

  const addTestimonial = useCallback(async(item:NewTestimonial)=>{
    if (software.id && token){
      const testimonial = {
        ...item,
        software: software.id
      }
      const resp = await postTestimonial({
        testimonial,
        token
      })
      // debugger
      if (resp.status === 201) {
        setTestimonials((data)=>{
          return [
            ...data,
            resp.message
          ]
        })
      } else {
        showErrorMessage(`Failed to add testimonial. Error: ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,token])

  const updateTestimonial = useCallback(async({data, pos}: {data: Testimonial, pos: number})=>{
    if (typeof pos == 'number' && data.id) {
      const testimonial = {
        ...data,
        software: software.id
      }
      const resp = await patchTestimonial({testimonial, token})
      if (resp.status === 200) {
        setTestimonials((testimonials)=>{
          // replace item in state
          const list = [
            ...testimonials.slice(0, pos),
            testimonial,
            ...testimonials.slice(pos+1)
          ].sort((a,b)=>sortOnNumProp(a,b,'position'))
          return list
        })
      } else {
        showErrorMessage(`Failed to update testimonial. Error: ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,token])

  const deleteTestimonial = useCallback(async(pos:number)=>{
    const id = testimonials[pos].id
    if (id){
      const resp = await deleteTestimonialById({id, token})
      if (resp.status === 200) {
        // remove item from the list
        const list = testimonials
          .filter(item=>item.id!==id)
          .map((item,pos) => {
            item.position = pos + 1
            return item
          })
        // patch testimonials position
        await sortedTestimonials(list)
      } else {
        showErrorMessage(`Failed to remove testimonial! Error: ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,testimonials])

  const sortedTestimonials = useCallback(async(newList:Testimonial[])=>{
    // update ui first
    setTestimonials(newList)
    // update db
    const resp = await patchTestimonialPositions({
      testimonials: newList,
      token
    })
    if (resp.status !== 200) {
      // revert back
      setTestimonials(testimonials)
      // show error
      showErrorMessage(`Failed to update testimonial positions! Error: ${resp.message}`)
    }
    // ignore showErrorMessage as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,testimonials])

  useEffect(() => {
    let abort = false
    const getTestimonials = async (software:string,token:string) => {
      const resp = await getTestimonialsForSoftware({
        software,
        token
      })
      if (abort) return
      // update state
      setTestimonials(resp ?? [])
      setLoadedSoftware(software)
      setLoading(false)
    }
    if (software?.id && token &&
      software?.id !== loadedSoftware) {
      getTestimonials(software.id,token)
    }
    return () => { abort = true }
  },[software?.id,token,loadedSoftware])

  return {
    loading,
    testimonials,
    software,
    addTestimonial,
    updateTestimonial,
    sortedTestimonials,
    deleteTestimonial
  }
}
