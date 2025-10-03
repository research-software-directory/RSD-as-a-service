// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
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
