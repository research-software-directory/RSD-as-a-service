// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import styled from '@mui/system/styled'

export const PageTitleSticky = styled('section')(({theme})=>({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'sticky',
  top: '0rem',
  padding: '1rem 0rem',
  alignItems: 'center',
  // borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
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
