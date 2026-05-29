// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

type ContributorAvatarProps=Readonly<{
  displayName:string|null,
  displayInitials:string,
  avatarUrl:string,
  size?:number,
  sx?: any
}>

export default function ContributorAvatar({
  displayName, displayInitials, avatarUrl, size=3, sx
}:ContributorAvatarProps) {
  return (
    <Avatar
      alt={displayName ?? 'Unknown'}
      src={avatarUrl ?? ''}
      sx={{
        width: `${size}rem`,
        height: `${size}rem`,
        fontSize: `${size/3}rem`,
        ...sx
      }
      }
    >
      {displayInitials}
    </Avatar>
  )
}
