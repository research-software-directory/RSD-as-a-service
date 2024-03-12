// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

import mockEditSoftware from './useSoftwareToEditData.json'

export default function useSoftwareToEdit({slug, token}: {slug: string, token: string}) {
  const [editSoftware, setEditSoftware] = useState<EditSoftwareItem>()
  const [loading, setLoading] = useState(true)
  const [loadedSlug, setLoadedSlug] = useState<string>('')

  // console.group('useEditSoftwareData...MOCKED')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('editSoftware...', editSoftware)
  // console.log('loading...', loading)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getSoftwareToEdit() {
      setLoading(true)
      if (abort) return
      setEditSoftware(mockEditSoftware as any)
      setLoadedSlug(slug)
      setLoading(false)
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
