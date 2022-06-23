// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import GitHubIcon from '@mui/icons-material/GitHub'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import {CodePlatform} from '~/types/SoftwareTypes'
import GitlabIcon from '../../assets/logos/gitlab-icon-rgb.svg'


export default function AboutSourceCode({repository,platform}: { repository: string | null, platform: CodePlatform}) {
  const code = '</>'

  function getIcon() {
    if (repository===null) return (<i>Not specified</i>)
    // abort if no info
    switch (platform) {
      case 'github':
        return (
          <a key={repository} href={repository ?? ''} title="Github repository" target="_blank" rel="noreferrer">
            <GitHubIcon sx={{
              width: '3rem',
              height: '3rem'
            }} />
          </a>
        )
      case 'gitlab':
        return (
          <a key={repository} href={repository ?? ''} title="Gitlab repository" target="_blank" rel="noreferrer">
            <GitlabIcon
              className="w-[3rem]"
            />
          </a>
        )
      default:
        return (
          <a key={repository} href={repository ?? ''} title="Repository" target="_blank" rel="noreferrer">
            <FolderOpenIcon sx={{
              width: '3rem',
              height: '3rem',
              color: 'secondary'
            }} />
          </a>
        )
    }
  }

  return (
    <>
    <div className="pt-8 pb-2">
      <span className="font-bold text-primary">{code}</span>
      <span className="text-primary pl-2">Source code</span>
    </div>
    <div className="py-1">
      {getIcon()}
    </div>
    </>
  )
}
