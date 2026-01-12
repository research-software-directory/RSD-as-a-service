// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import GitHubIcon from '@mui/icons-material/GitHub'
import SourceIcon from '@mui/icons-material/Source'
import Avatar from '@mui/material/Avatar'
import GitlabIcon from '~/assets/logos/gitlab-icon-rgb.svg'
import BitbucketIcon from '~/assets/logos/bitbucket_blue.svg'
import CodebergIcon from '~/assets/logos/codeberg_blue.svg'
import {CodePlatform} from './apiRepositories'

type RepositoryIconProps = Readonly<{
  platform?: CodePlatform|null,
  size?: string
}>

export default function RepositoryIcon({platform,size='3rem'}:RepositoryIconProps) {
  // do not show if no platform
  if (!platform) return null

  switch(platform){
    case 'github':
      // github icon is material-ui icon
      return <GitHubIcon sx={{width:size,height:size}} />
    case 'gitlab':
      // gitlab image is imported icon
      return <GitlabIcon style={{width:size,height:size}}/>
    case 'bitbucket':
      return <BitbucketIcon style={{width:size,height:size}}/>
    case 'codeberg':
      return <CodebergIcon style={{width:size,height:size}}/>
    case '4tu':
      return (
        <Avatar
          alt="4TU."
          src="/images/4tu-logo.png"
          sx={{
            width: size,
            height: size,
            fontSize: '1.25rem',
            color: '#F2971A',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          4TU.
        </Avatar>
      )
    default:
      // default is material-ui icon
      return (
        <SourceIcon sx={{
          width: size,
          height: size,
          fill: 'var(--rsd-base-content-secondary,#ccc)'
        }} />
      )
  }
}
