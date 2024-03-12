// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import mockEditSoftware from './useSoftwareTableData.json'
import {EditSoftwareDescriptionProps} from '../useSoftwareTable'

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
        if (abort) return
        setEditSoftware(mockEditSoftware as any)
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
