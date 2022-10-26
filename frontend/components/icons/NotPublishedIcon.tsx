// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function NotPublishedIcon(){
  return (
    <span
      title="Not published"
    >
      <VisibilityOffIcon
        sx={{
          width: '2.5rem',
          height: '2.5rem',
        }}
      />
    </span>
  )
}
