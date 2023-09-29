// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import AutoDeleteIcon from '@mui/icons-material/AutoDelete'

type DeleteOldLogs={
  disabled: boolean
  onDelete:()=>void
}

export default function DeleteOldLogsBtn({disabled,onDelete}:DeleteOldLogs) {
  return (
    <IconButton
      title="Delete logs older than 30 days"
      disabled={disabled}
      sx={{
        alignSelf:'center',
        marginRight:'1rem'
      }}
      onClick={onDelete}
    >
      <AutoDeleteIcon />
    </IconButton>
  )
}
