// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import VerifyGithubUrl from './VerifyGithubUrl'

export const config = {
  repository_url: {
    label: 'Repository URL',
    help: (repoUrl: string | null) => repoUrl ? <VerifyGithubUrl url={repoUrl}/> : '',
    validation: {
      required: 'Repository URL is required',
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/\S+$/,
        message: 'URL must start with http(s):// and cannot include white spaces.'
      }
    }
  },
  repository_platform: {
    label: 'Platform',
    help: 'Select the platform',
    options: [
      {label: 'GitHub', value: 'github'},
      {label: 'GitLab', value: 'gitlab'},
      {label: 'Bitbucket', value: 'bitbucket'},
      {label: '4TU', value: '4tu'},
      {label: 'Codeberg', value: 'codeberg'},
      {label: 'Other', value: 'other'},
    ],
    validation: {
      required: 'Code platform is required',
    }
  },
  repository_disabled_scraping_reason: {
    label: 'Reason why scraping is disabled',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'}
    }
  }
}
