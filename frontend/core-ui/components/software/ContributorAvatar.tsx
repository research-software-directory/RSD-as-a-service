// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

export default function ContributorAvatar({displayName, displayInitials, avatarUrl, size=3}: {
  displayName:string,displayInitials:string,avatarUrl:string,size?:number
}) {
  return (
    <Avatar
      alt={displayName ?? 'Unknown'}
      src={avatarUrl ?? ''}
      sx={{
        width: `${size}rem`,
        height: `${size}rem`,
        fontSize: `${size/3}rem`,
        marginRight: '1rem'
      }}
    >
      {displayInitials}
    </Avatar>
  )
}
