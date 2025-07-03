// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'

type LinkAccountBtnProps=Readonly<{
  label: string
  disabled: boolean
  href: string
  sxStyle?: any
}>

export default function LinkAccountBtn({label,disabled,href,sxStyle}:LinkAccountBtnProps) {
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
