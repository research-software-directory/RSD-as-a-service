// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type NewProjectTestimonial = NewTestimonial & {
  project: string
}

export type ProjectTestimonial = NewProjectTestimonial & {
  id: string
  position: number
}

export async function getTestimonialsForProject({project,token}:{project:string,token?:string}){
  try{
    const url = `${getBaseUrl()}/testimonial_for_project?project=eq.${project}&order=position`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })
    if (resp.ok){
      const testimonials:ProjectTestimonial[] = await resp.json()
      return testimonials
    }
    logger(`getTestimonialsForProject: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  }catch(e:any){
    logger(`getTestimonialsForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function addProjectTestimonial({testimonial,token}:{testimonial:NewProjectTestimonial,token:string}){
  try{
    const url = `${getBaseUrl()}/testimonial_for_project`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(testimonial)
    })
    if (resp.status === 201) {
      const json = await resp.json()
      if (json.length > 0) {
        // we return stored record
        return {
          status: 201,
          message: json[0]
        }
      } else {
        logger('addProjectTestimonial: resp.json() returned no records', 'error')
        return {
          status: 400,
          message: 'Bad request'
        }
      }
    } else {
      return extractReturnMessage(resp)
    }
  }catch(e:any){
    logger(`addProjectTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function updateProjectTestimonial({data,token}:{data:ProjectTestimonial,token:string}){
  try{
    const url = `${getBaseUrl()}/testimonial_for_project?id=eq.${data.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp,data.id)
  }catch(e:any){
    logger(`patchProjectTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deleteProjectTestimonial({id,token}:{id:string,token:string}){
  try {
    const url = `${getBaseUrl()}/testimonial_for_project?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`deleteProjectTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

/**
 * Patch testimonial position.
 * For this we do not need project id, we patch by testimonial id.
 * @param param0
 * @returns
 */
export async function patchTestimonialPositions({testimonials, token}: {testimonials: Testimonial[], token: string}) {
  try {
    // if the array is empty return
    if (testimonials.length === 0) return {status:200,message:'OK'}
    // create all requests
    const requests = testimonials.map(testimonial => {
      const url = `${getBaseUrl()}/testimonial_for_project?id=eq.${testimonial.id}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: testimonial.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchTestimonialPositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
