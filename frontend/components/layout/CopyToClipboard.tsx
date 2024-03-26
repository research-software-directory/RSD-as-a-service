// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import CopyIcon from '@mui/icons-material/ContentCopy'

import {copyToClipboard,canCopyToClipboard} from '~/utils/copyToClipboard'

type CopyToClipboardProps={
  label:string,
  value:string|null,
  onCopied:(ok:boolean)=>void
  btnProps?:any
}

export default function CopyToClipboard({label,value,btnProps,onCopied}:CopyToClipboardProps) {

  const isDisabled = !canCopyToClipboard() && value == null

  async function toClipboard() {
    if (value) {
      // copy value to clipboard
      const copied = await copyToClipboard(value)
      // notify user about copy action
      onCopied(copied)
    }
  }

  return (
    <Button
      aria-label={label}
      disabled={isDisabled}
      startIcon={<CopyIcon />}
      onClick={toClipboard}
      {...btnProps}
    >
      {label}
    </Button>
  )
}
