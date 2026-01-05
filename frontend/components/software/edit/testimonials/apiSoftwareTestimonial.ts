// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {NewTestimonial, Testimonial} from '~/types/Testimonial'

export type NewSoftwareTestimonial = NewTestimonial & {
  software: string
}

export type SoftwareTestimonial = NewSoftwareTestimonial & {
  id: string
  position: number
}

export async function getTestimonialsForSoftware({software, token}:
{software: string, token?: string}) {
  try {

    const url = `${getBaseUrl()}/testimonial?software=eq.${software}&order=position.asc`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: SoftwareTestimonial[] = await resp.json()
      // update position to reflect array
      return data.map((item, pos) => {
        return {
          ...item,
          position: pos + 1
        }
      })
    }
    // errors
    logger(`getTestimonialsForSoftware: ${resp.status} ${resp.statusText} ${url}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getTestimonialsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function postTestimonial({testimonial, token}: {testimonial: NewSoftwareTestimonial, token: string}) {
  try {
    const url = `${getBaseUrl()}/testimonial`
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
        logger('postTestimonial: resp.json() returned no records', 'error')
        return {
          status: 400,
          message: 'Bad request'
        }
      }
    } else {
      return extractReturnMessage(resp)
    }
  } catch (e: any) {
    logger(`postTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function patchTestimonial({testimonial, token}: {testimonial: SoftwareTestimonial, token: string}) {
  try {
    const url = `${getBaseUrl()}/testimonial?id=eq.${testimonial.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(testimonial)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchTestimonialPositions({testimonials, token}: {testimonials: Testimonial[], token: string}) {
  try {
    // if the array is empty return
    if (testimonials.length === 0) return {status:200,message:'OK'}
    // create all requests
    const requests = testimonials.map(testimonial => {
      const url = `${getBaseUrl()}/testimonial?id=eq.${testimonial.id}`
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
    logger(`patchTestimonial: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function deleteTestimonialById({id, token}: {id: string, token: string}) {
  try {
    const url = `${getBaseUrl()}/testimonial?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`deleteTestimonialById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
