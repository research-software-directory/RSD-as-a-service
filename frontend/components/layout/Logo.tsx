// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'
import LogoMenu from './LogoMenu'

export type ImageDataProps = {
  data: string,
  mime_type: string
}

type LogoProps = {
  name: string,
  logo: string | null
  onAddLogo: ({data, mime_type}: ImageDataProps) => void
  onRemoveLogo: () => void
  canEdit?:boolean
  src?: string
  sx?: any
  props?: any
}

export default function Logo({
  name,logo,onAddLogo,onRemoveLogo,
  canEdit=false,src,sx,
  // other avatar props
  ...props
}:LogoProps) {
  return (
    <>
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
      {canEdit ?
        <LogoMenu
          logo={logo}
          onAddLogo={onAddLogo}
          onRemoveLogo={onRemoveLogo}
        />
        : null
      }
    </>
  )
}
