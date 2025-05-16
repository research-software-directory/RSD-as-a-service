// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {styled} from '@mui/material/styles'
import {ReactNode} from 'react'

const StyledArticle = styled('article')(()=>({
  flex:1,
  display:'flex',
  justifyContent:'center',
  alignItems:'center'
}))

export default function ContentInTheMiddle({children,...props}:{children:ReactNode,props?:any}) {
  return (
    <StyledArticle
      {...props}
    >
      {children}
    </StyledArticle>
  )
}
