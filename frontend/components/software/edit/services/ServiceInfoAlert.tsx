// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
        This section shows all background services executed by RSD to collect
        the additional information about your software.
      </p>
      <p className="py-2">
        For each service you see when the information is extracted for the last time. If there were errors during the extraction process we try to construct a human readable message from received error.
      </p>
      <p className="py-2 font-medium">
        Please contact us at <a href={`mailto:${host.email}`} target="_blank">{host.email}</a> in case you need our assistance in solving any of the errors.
      </p>
    </Alert>
  )
}
