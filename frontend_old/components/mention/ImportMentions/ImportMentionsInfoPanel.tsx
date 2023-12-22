// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
// import AlertTitle from '@mui/material/AlertTitle'

import config from './config'

export default function ImportMentionsInfoPanel({children}:{children:any}) {
  return (
    <Alert
      severity="info"
      icon={false}
    >
      {/* <AlertTitle>Import publications using DOI list</AlertTitle> */}
      Import up to {config.doiInput.maxRows} publications providing a list of
      DOI&apos;s. All metadata will be imported automatically.
      { children }
    </Alert>
  )
}
