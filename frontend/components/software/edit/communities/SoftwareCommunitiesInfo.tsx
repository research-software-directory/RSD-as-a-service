// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function SoftwareCommunitiesInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'2rem'
      }}
    >
      <AlertTitle>How to join a community?</AlertTitle>
      <p>
        Use search to find the community you want to join.
        After you select community, it is added to your community list with the initial status of <strong>pending</strong> request.
      </p>
      <p className="py-4">
        Your software will be listed in the request section of the community for community administrators to approve your request.
        The community maintainer will inspect your request and approve or deny your membership.
      </p>
      <p>
        The status of your community requests is shown in the overview in the top right corner and will one of the following:
        pending, accepted or rejected.
      </p>
    </Alert>
  )
}
