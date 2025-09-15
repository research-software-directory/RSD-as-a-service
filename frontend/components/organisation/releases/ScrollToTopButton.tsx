// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback, useEffect, useState} from 'react'
import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation'

type ScrollToTopProps = {
  minOffset: number,
  sx?: any
}

export default function ScrollToTopButton({minOffset, sx}:ScrollToTopProps) {
  const [show, setShow] = useState(false)

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset
    if (minOffset < position) {
      setShow(true)
    }
    if (show === true && minOffset >= position) {
      setShow(false)
    }
  }, [minOffset, show])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // return null when not to show
  if (show===false) return null

  return (
    <Fab
      title="Back to top"
      color='primary'
      onClick={()=>window.scrollTo(0,0)}
      sx={{
        position: 'fixed',
        right: '3rem',
        ...sx ?? {bottom: '3rem'}
      }}
    >
      <NavigationIcon />
    </Fab>
  )
}
