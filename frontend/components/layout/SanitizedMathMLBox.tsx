// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import DOMPurify from 'dompurify'
import Box from '@mui/material/Box'

export default function SanitizedMathMLBox({rawHtml,...props}:any){
  const [innerHtml,setInnerHtml] = useState('')

  // sanitize raw html - FE only
  // NOTE! DOMPurify does not work server side
  useEffect(()=>{
    if (rawHtml) {
      const innerHtml = DOMPurify.sanitize(rawHtml,{USE_PROFILES: {mathMl: true}})
      setInnerHtml(innerHtml)
    }
  },[rawHtml])

  // console.group('SanitizedHtmlBox')
  // console.log('innerHtml...', innerHtml)
  // console.groupEnd()

  return(
    <Box
      {...props}
      dangerouslySetInnerHTML={{__html: innerHtml}}
    />
  )
}
