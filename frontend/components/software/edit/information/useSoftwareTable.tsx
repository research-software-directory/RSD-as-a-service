// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'
import {EditSoftwareImage, SoftwareTableItem} from '~/types/SoftwareTypes'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type EditSoftwareDescriptionProps = SoftwareTableItem & EditSoftwareImage

export async function getSoftwareTable({slug, token}:
{slug: string, token: string}) {
  try {
    // GET
    const url = `${getBaseUrl()}/software?slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token),
    })
    if (resp.status === 200) {
      const data: SoftwareTableItem[] = await resp.json()
      return {
        ...data[0],
        image_b64: null,
        image_mime_type: null,
      }
    }
  } catch (e: any) {
    logger(`getSoftwareTable: ${e?.message}`, 'error')
  }
}

export default function useSoftwareTable({slug, token}: {slug: string|null, token: string}) {
  const [editSoftware, setEditSoftware] = useState<EditSoftwareDescriptionProps>()
  const [loading, setLoading] = useState(true)
  const [loadedSlug, setLoadedSlug] = useState<string>('')

  // console.group('useSoftwareTable')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('editSoftware...', editSoftware)
  // console.log('loading...', loading)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getSoftwareToEdit() {
      if (slug !== null) {
        setLoading(true)
        const software = await getSoftwareTable({slug, token})
        if (abort) return
        setEditSoftware(software)
        setLoadedSlug(slug)
        setLoading(false)
      }
    }
    if (slug && token &&
      slug !== loadedSlug) {
      getSoftwareToEdit()
    }
    return ()=>{abort=true}
  },[slug,token,loadedSlug])

  return {
    slug,
    loading,
    editSoftware,
    setEditSoftware
  }
}
