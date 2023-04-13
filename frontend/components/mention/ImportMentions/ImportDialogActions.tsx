// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import DialogActions from '@mui/material/DialogActions'

export default function ImportDialogActions({children}:{children:any}) {
  return (
    <DialogActions sx={{
      padding: '1rem 1.5rem',
      borderTop: '1px solid',
      borderColor: 'divider'
    }}>
      {children}
    </DialogActions>
  )
}
