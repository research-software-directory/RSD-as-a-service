// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {useCommunityContext} from '../../context'


export default function useCommunityHasCategories(){
  const {community:{id}} = useCommunityContext()
  const [hasCategories, setHasCategories] = useState(false)

  useEffect(()=>{
    let abort = false

    if (id){
      loadCategoryRoots({community:id})
        .then(roots=>{
          if (abort) return
          setHasCategories(roots.length > 0)
        })
    }
    return ()=>{abort=true}
  },[id])

  return hasCategories
}
