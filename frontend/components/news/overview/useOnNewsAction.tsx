// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter} from 'next/navigation'
import {useCallback} from 'react'
import logger from '~/utils/logger'

export type NewsAction={
  type: 'VIEW'|'EDIT'|'DELETE',
  payload: string
}

export default function useOnNewsAction() {
  const router = useRouter()

  const onNewsAction = useCallback((action:NewsAction)=>{
    // console.log('onAction...', action)
    switch(action.type){
      case 'VIEW':
        router.push(action.payload)
        break
      case 'EDIT':
        router.push(action.payload)
        break
      default:
        logger(`Not supported action type ${action.type}`,'warn')
    }
  },[router])

  return onNewsAction
}
