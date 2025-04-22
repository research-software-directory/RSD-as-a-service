// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'

type LinkAccountBtnProps=Readonly<{
  label: string
  disabled: boolean
  href?: string|null
  sxStyle?: any
}>

export default function LinkAccountBtn({label,disabled,href,sxStyle}:LinkAccountBtnProps) {
  if (href){
    return (
      <Button
        disabled={disabled}
        href={href}
        variant="contained"
        sx={{
          // we need to overwrite global link styling from tailwind
          // because the type of button is a link (we use href param)
          ':hover':{
            color:'primary.contrastText'
          },
          ...sxStyle
        }}
      >
        {/* Link my account */}
        {label}
      </Button>
    )
  }
  return null
}
