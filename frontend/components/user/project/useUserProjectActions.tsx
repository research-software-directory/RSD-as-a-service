// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchProjectTable} from '~/components/projects/edit/information/patchProjectInfo'
import useUserMenuOptions, {UserMenuAction} from './useUserMenuOptions'
import {ProjectByMaintainer} from './useUserProjects'

export default function useUserProjectActions({item}:{item:ProjectByMaintainer}) {
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [project, setProject] = useState(item)
  // dynamic menu options
  const menuOptions = useUserMenuOptions({
    is_published: project.is_published
  })

  async function publishProject({is_published}:{is_published:boolean}){
    const resp = await patchProjectTable({
      id: project.id,
      data:{
        is_published
      },
      token
    })

    if (resp.status===200){
      // update local project object
      setProject({
        ...project,
        is_published
      })
    }else{
      showErrorMessage(`Failed to update ${project.title}. ${resp.message}`)
    }
  }

  function onAction(action: UserMenuAction){
    switch(action.type){
      case 'VIEW':
        router.push(`/projects/${project.slug}`)
        break
      case 'EDIT':
        router.push(`/projects/${project.slug}/edit`)
        break
      case 'PUBLISH':
        publishProject({
          is_published: true
        })
        break
      case 'UNPUBLISH':
        publishProject({
          is_published: false
        })
        break
      default:
        logger(`Action type ${action.type} NOT SUPPORTED. Check your spelling.`, 'warn')
    }
  }

  return {
    project,
    menuOptions,
    onAction,
  }
}
