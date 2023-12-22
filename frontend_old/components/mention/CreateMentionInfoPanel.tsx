// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function CreateMentionInfoPanel({children}:{children:any}) {
  return (
    <Alert
      severity="info"
      icon={false}
    >
      {/* <AlertTitle>Add existing publication</AlertTitle> */}
      Create a new item that does not have a DOI by providing all information manually.
      { children }
    </Alert>
  )
}
