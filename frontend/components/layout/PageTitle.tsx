// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {ReactNode} from 'react'
import {styled} from '@mui/material/styles'

export const PageTitleSticky = styled('section')(({theme})=>({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'sticky',
  top: '0rem',
  padding: '1rem 0rem',
  alignItems: 'center',
  // add default because turbopack seem to crash here on undefined paper value
  backgroundColor: theme.palette?.background?.paper ?? '#fff',
  zIndex: 9,
  '@media (max-width: 640px)':{
    flexDirection:'column',
    flexWrap: 'wrap',
    position: 'relative'
  },
  '@media (max-height: 640px)':{
    flexDirection:'column',
    flexWrap: 'wrap',
    position: 'relative'
  },
}))

export default function PageTitle({title,children}:{title:string,children?:ReactNode}) {
  return (
    <PageTitleSticky>
      <h1 className="flex-1 flex w-full mb-4 md:my-4">{title}</h1>
      {children}
    </PageTitleSticky>
  )
}
