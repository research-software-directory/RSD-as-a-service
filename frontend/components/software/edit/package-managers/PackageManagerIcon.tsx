// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'
import GitHubIcon from '@mui/icons-material/GitHub'
import GitlabIcon from '~/assets/logos/gitlab-icon-rgb.svg'

import {packageManagerSettings, PackageManagerTypes} from './config'

type PackageMangerIconProps=Readonly<{
  platform?: PackageManagerTypes
  size?: string
}>

export default function PackageMangerIcon({platform,size='3rem'}:PackageMangerIconProps) {
  // do not show if no platform
  if (!platform) return null
  // extract icon from settings
  const info = packageManagerSettings[platform]

  switch(platform){
    case 'github':
      // github icon is material-ui icon
      return <GitHubIcon sx={{width:size,height:size}} />
    case 'gitlab':
      // gitlab image is imported icon
      return <GitlabIcon style={{width:size,height:size}}/>
    default:
      return (
        <Avatar
          variant="square"
          src={info.icon ?? ''}
          sx={{
            width: size,
            height: size,
            '& img': {
              objectFit: 'contain'
            }
          }}
        >
          {platform?.slice(0,3)}
        </Avatar>
      )
  }
}
