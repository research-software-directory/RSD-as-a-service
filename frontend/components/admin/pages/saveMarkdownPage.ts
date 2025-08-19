// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdLink} from '~/config/rsdSettingsReducer'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {MarkdownPage} from './useMarkdownPages'

export async function addMarkdownPage({page,token}:{page:MarkdownPage,token:string}) {
  try {
    const query = 'meta_page'
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(page)
    })
    if (resp.status === 201) {
      const json = await resp.json()
      // return created page
      return {
        status: 200,
        message: json[0]
      }
    } else {
      return extractReturnMessage(resp, '')
    }
  } catch (e: any) {
    logger(`addMarkdownPage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function saveMarkdownPage({page,token}:{page:MarkdownPage,token:string}) {
  try {
    const query = `meta_page?id=eq.${page.id}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(page)
    })
    return extractReturnMessage(resp, page.id)
  } catch (e: any) {
    logger(`saveMarkdownPage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updatePagePositions({items,token}:{items:RsdLink[],token:string}) {
  try {
    const updates:Promise<any>[] = []
    // add promises to array
    items.forEach(item => {
      updates.push(
        patchMarkdownData({
          id: item.id,
          data: {
            position: item.position
          },
          token
        })
      )
    })
    if (updates.length > 0) {
      // make all requests
      const responses = await Promise.all(updates)
      const errors = extractErrorMessages(responses)
      // return result
      if (errors.length > 0) {
        // return first error for now
        return {
          status: errors[0].status,
          message: errors[0].message
        }
      }
      return {
        status: 200,
        message: 'OK'
      }
    }
    return {
      status: 400,
      message: 'Bad request. Items not provided'
    }
  } catch (e: any) {
    logger(`updatePagePositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchMarkdownData({id,data,token}:{id:string,data:any,token:string}) {
  try {
    const query = `meta_page?id=eq.${id}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchMarkdownData: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteMarkdownPage({slug,token}:{slug:string,token:string}) {
  try {
    const query = `meta_page?slug=eq.${slug}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, slug)
  } catch (e: any) {
    logger(`deleteMarkdownPage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
