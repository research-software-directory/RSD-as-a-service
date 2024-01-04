// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import useRsdSettings from '~/config/useRsdSettings'

export default function ServiceInfoAlert() {
  const {host} = useRsdSettings()

  return (
    <Alert severity="info"
      sx={{
        marginTop: '0.5rem'
      }}
    >
      <AlertTitle sx={{fontWeight:500}}>Background services</AlertTitle>
      <p>
        The RSD collects additional information about your software using the links you
        have provided. For example, the software repository URL is used to collect
        information about the commit history and programming languages, and a
        package manager URL can be used to retrieve download numbers.
      </p>
      <p className="py-2">
        This section provides feedback if the RSD could succesfully retrieve
        this information or if it has encountered an error. These may be caused by
        missing or incorrect URL.
      </p>
      <p className="py-2 font-medium">
        Please contact us at <a href={`mailto:${host.email}`} target="_blank">{host.email}</a> in case you need our assistance in solving any of the errors.
      </p>
    </Alert>
  )
}
