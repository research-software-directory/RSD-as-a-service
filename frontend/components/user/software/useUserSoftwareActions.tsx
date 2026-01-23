// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

import logger from '~/utils/logger'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchSoftwareTable} from '~/components/software/edit/information/patchSoftwareTable'
import useUserMenuOptions, {UserMenuAction} from '~/components/user/project/useUserMenuOptions'
import {SoftwareByMaintainer} from './useUserSoftware'

export default function useUserSoftwareActions({item}:{item:SoftwareByMaintainer}) {
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [software, setSoftware] = useState(item)
  // dynamic menu options
  const menuOptions = useUserMenuOptions({
    is_published: software.is_published
  })

  async function publishSoftware({is_published}:{is_published:boolean}){
    const resp = await patchSoftwareTable({
      id: software.id,
      data:{
        is_published
      },
      token
    })

    if (resp.status===200){
      // update local software object
      setSoftware({
        ...software,
        is_published
      })
    }else{
      showErrorMessage(`Failed to update ${software.brand_name}. ${resp.message}`)
    }
  }

  function onAction(action: UserMenuAction){
    switch(action.type){
      case 'VIEW':
        // open software page for view
        router.push(`/software/${software.slug}`)
        break
      case 'EDIT':
        // open software page for editing
        router.push(`/software/${software.slug}/edit`)
        break
      case 'PUBLISH':
        publishSoftware({
          is_published: true
        })
        break
      case 'UNPUBLISH':
        publishSoftware({
          is_published: false
        })
        break
      default:
        logger(`Action type ${action.type} NOT SUPPORTED. Check your spelling.`, 'warn')
    }
  }

  return {
    software,
    menuOptions,
    onAction,
  }
}
