// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function FindMentionInfoPanel({children}:{children:any}) {
  return (
    <Alert
      severity="info"
      icon={false}
    >
      {/* <AlertTitle>Add existing publication</AlertTitle> */}
      We search in <strong> <a href="https://www.crossref.org/" target="_blank">Crossref</a>, <a href="https://datacite.org" target="_blank">DataCite</a>, <a href="https://openalex.org/" target="_blank">OpenAlex</a></strong> and the RSD.
      All metadata will be imported automatically.
      { children }
    </Alert>
  )
}
