// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import DialogTitle from '@mui/material/DialogTitle'

export default function ImportDialogTitle({title}:{title:string}) {
  return (
    <DialogTitle
      sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}
    >
      {title}
    </DialogTitle>
  )
}
