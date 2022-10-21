// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function EditMentionsInfo({title}:{title:string}) {
  return (
    <Alert severity="info">
      <AlertTitle>{title}</AlertTitle>
      Manually added items using <strong>ADD</strong> button can be edited by RSD adminstrators only.
      Please validate provided information before saving a new entry.
      <br/><br/>
      The items from <strong>Crossref or DataCite</strong> can only be added or removed.
      These items contain information registered for specified DOI. The information is
      periodically updated by our DOI refresh service.
    </Alert>
  )
}
