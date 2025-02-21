// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {loadCategoryRoots} from '~/components/category/apiCategories'

export default function useHasCategories() {
  const [hasCategories, setHasCategories] = useState(false)

  useEffect(()=>{
    let abort = false

    loadCategoryRoots({})
      .then(roots=>{
        if (abort) return
        setHasCategories(roots.length > 0)
      })

    return ()=>{abort=true}
  },[])

  return hasCategories
}
