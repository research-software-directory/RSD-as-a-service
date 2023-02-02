// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef, useState} from 'react'
import styled from '@emotion/styled'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import Box from '@mui/material/Box'
import {Theme} from '@mui/material/styles/createTheme'
import Slide from '@mui/material/Slide'


const NoContentText = styled('h2')(({theme}:{theme?:Theme}) => ({
  fontWeight: 500,
  letterSpacing: '0.25rem',
  textTransform: 'uppercase',
  padding: '1rem 0rem'
}))

const NoContentBody = styled('div')(({theme}:{theme?:Theme}) => ({
  margin:'2rem 0rem 0rem 0rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0.25
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
      component="div"
    >
      <Slide direction="up" in={show} container={containerRef.current}>
        <NoContentBody>
          <DoDisturbIcon
            sx={{
              width: '5rem',
              height: '5rem',
              // color: 'grey.500'
            }}
          />
          <NoContentText>{message}</NoContentText>
        </NoContentBody>
      </Slide>
    </Box>
  )
}
