// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Tooltip from '@mui/material/Tooltip'

export default function TenantBadge() {
  return (

    <Tooltip
      title="Member organisation"
      placement='top'
      sx={{
        cursor:'default'
      }}
    >
      <CheckCircleOutlineIcon sx={{width:'1.5rem', height:'1.5rem',margin:'0rem 0.25rem'}} />
    </Tooltip>

  )
}
