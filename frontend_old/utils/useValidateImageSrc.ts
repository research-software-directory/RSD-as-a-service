// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'


export default function useValidateImageSrc(src?: string|null) {
  const [valid, setValid] = useState<boolean>()

  useEffect(() => {
    let abort = false

    if (typeof src === 'string') {
      const image = new Image()
      // listen for events
      image.onload = (props) => {
        // console.log('useValidImageLink...onload...',props)
        if (abort) return
        setValid(true)
      }
      image.onerror = ((props) => {
        // console.log('useValidImageLink...onerror...', props)
        if (abort) return
        setValid(false)
      })
      // assign value
      image.src = src
    } else {
      setValid(false)
    }
    return () => { abort = true }
  }, [src])

  return valid
}
