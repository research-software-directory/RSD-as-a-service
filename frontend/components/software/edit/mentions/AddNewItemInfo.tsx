// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function AddNewItemInfo() {
  return (
    <Alert
        severity="info"
        sx={{
          marginTop:'1rem'
        }}
      >
        <AlertTitle>Add new item without a DOI</AlertTitle>
        To add an new item to this page that does not have a DOI you will need to provide
        the relevant information manually. Please ensure that this information is complete
        and correct before saving the item, as this <strong>information cannot be changed afterwards</strong>.
      </Alert>
  )
}
