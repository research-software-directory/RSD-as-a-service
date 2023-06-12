// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import Link from 'next/link'
import useRsdSettings from '~/config/useRsdSettings'

export default function ContributorPrivacyHint() {
  const {host} = useRsdSettings()
  return (
    <Alert severity="info" sx={{marginTop:'1rem'}}>
      Before adding an individual, make sure to ask for their permission to appear in the RSD. Please see our <strong><u><Link href={host?.terms_of_service_url ?? ''} target="_blank">Terms of Service</Link></u></strong> for more information.
    </Alert>
  )
}
