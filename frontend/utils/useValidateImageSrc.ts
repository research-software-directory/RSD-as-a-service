// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import validateImageSrc from './validateImageSrc'


export default function useValidateImageSrc(src?: string|null) {
  const [valid, setValid] = useState<boolean>()

  useEffect(() => {
    let abort = false

    if (typeof src === 'string') {
      if (src===''){
        setValid(false)
      }else{
        // validate if url returns image
        validateImageSrc(src)
          .then((val)=>{
            if (abort) return
            setValid(val)
          })
      }
    } else {
      setValid(false)
    }
    return () => { abort = true }
  }, [src])

  return valid
}
