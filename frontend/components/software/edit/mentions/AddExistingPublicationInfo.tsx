// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function AddExistingPublicationInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'1rem'
      }}
    >
      <AlertTitle>Add existing publication</AlertTitle>
      To add an existing publication to this page, you can <strong>search Crossref, DataCite</strong> and the RSD using the DOI
      or title of the publication and selecting one of the search results. No further information is needed when
      adding these publications, as all metadata will be imported automatically.
    </Alert>
  )
}
