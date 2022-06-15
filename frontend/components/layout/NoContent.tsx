// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef, useState} from 'react'
import styled from '@emotion/styled'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import {Box, Theme} from '@mui/material'
import Slide from '@mui/material/Slide'

const NoContentText = styled('h2')(({theme}:{theme?:Theme}) => ({
  fontSize: '2.5rem',
  fontWeight: 500,
  letterSpacing: '0.25rem',
  textTransform: 'uppercase',
  padding: '0.5rem 0rem 0rem 1rem',
  color: theme?.palette.grey[500]
}))

export default function NoContent({message='nothing to show'}:{message?:string}) {
  const [show, setShow]=useState(false)
  const containerRef = useRef()

  useEffect(() => {
    let abort=false
    setTimeout(() => {
      if(abort) return
      setShow(true)
    }, 200)
    return ()=>{abort=true}
  }, [])

  return (
    <Box
      ref={containerRef}
      sx={{
        flex:1,
        overflow: 'hidden'
      }}
    >
      <Slide direction="up" in={show} container={containerRef.current}>
        <div className="mt-12 flex justify-center">
          <DoDisturbIcon
            sx={{
              width: '3rem',
              height: '3rem',
              color: 'grey.500'
            }}
          />
          <NoContentText>{message}</NoContentText>
        </div>
      </Slide>
    </Box>
  )
}
