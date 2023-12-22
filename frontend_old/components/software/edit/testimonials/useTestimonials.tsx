// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import {Testimonial} from '~/types/Testimonial'
import {getTestimonialsForSoftware} from '~/utils/editTestimonial'
import useSoftwareContext from '../useSoftwareContext'

export default function useTestimonals() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedSoftware, setLoadedSoftware] = useState('')

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
    setTestimonials,
    software
  }
}
