// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
// import AlertTitle from '@mui/material/AlertTitle'

import config from './config'

export default function ImportMentionsInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'1rem'
      }}
    >
    {/* <AlertTitle>Import publications using DOI list</AlertTitle> */}
      Import up to {config.doiInput.maxRows} publications providing a <strong>list of
      DOI&apos;s</strong>. All metadata will be imported automatically.
    </Alert>
  )
}
