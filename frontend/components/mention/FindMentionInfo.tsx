// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function FindMentionInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'1rem'
      }}
    >
      {/* <AlertTitle>Add existing publication</AlertTitle> */}
      To add an existing publication to this page, you can <strong>search <a href="https://crossref.org" target="_blank">Crossref</a>, <a href="https://datacite.org" target="_blank">DataCite</a></strong> and the RSD using the DOI or title of the publication. All metadata will be imported automatically.
    </Alert>
  )
}
