// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

type LogoAvatarProps = {
  name: string,
  src?: string
  sx?: any
  props?: any
}

export default function LogoAvatar({name,src,sx,...props}:LogoAvatarProps) {
  return (
    <Avatar
      data-testid="logo-avatar"
      alt={name}
      src={src}
      sx={{
        // lighthouse audit requires explicit width and height
        width: '100%',
        height: '100%',
        fontSize: '3rem',
        '& img': {
          // height: 'auto',
          maxHeight: '100%',
          // width: 'auto',
          maxWidth: '100%'
        },
        ...sx
      }}
      variant="square"
      title={name}
      {...props}
    >
      {name.slice(0,3)}
    </Avatar>
  )
}
