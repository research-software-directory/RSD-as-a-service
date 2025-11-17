// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RepositoryUrl} from './apiRepositories'
import VerifyGithubUrl from './VerifyGithubUrl'

export type ServiceListProps={
  name: string,
  desc: string,
  props:{
    value: keyof RepositoryUrl | string[],
    scraped_at: keyof RepositoryUrl,
    last_error: keyof RepositoryUrl,
    url: keyof RepositoryUrl,
    disable_reason: keyof RepositoryUrl
  },
  dbprops?: string[]
}

export const repoServiceList={
  commit_history:{
    name: 'Commit history',
    desc: 'Commit history, extracted from the repository api, is used in the chart on the software page.',
    props:{
      value: 'commit_history',
      scraped_at:'commit_history_scraped_at',
      last_error:'commit_history_last_error',
      disable_reason: 'scraping_disabled_reason',
      url:'url'
    },
    dbprops: ['commit_history','commit_history_scraped_at']
  },
  languages:{
    name: 'Programming languages',
    desc: 'The list of programming languages of first repo is shown on software page.',
    props:{
      value: 'languages',
      scraped_at:'languages_scraped_at',
      last_error:'languages_last_error',
      disable_reason: 'scraping_disabled_reason',
      url:'url'
    },
    dbprops: ['languages','languages_scraped_at']
  },
  repo_stats:{
    name: 'Repository statistics',
    desc: 'Star count, fork count, open issues count extracted from api.',
    props:{
      value: 'star_count',
      scraped_at: 'basic_data_scraped_at',
      last_error: 'basic_data_last_error',
      disable_reason: 'scraping_disabled_reason',
      url: 'url'
    },
    dbprops: ['star_count', 'fork_count', 'open_issue_count', 'contributor_count','basic_data_scraped_at']
  },
  contributor_cnt:{
    name: 'Contributor count',
    desc: 'Extract contributor count from api.',
    props:{
      value: 'contributor_count',
      scraped_at: 'contributor_count_scraped_at',
      last_error: 'contributor_count_last_error',
      disable_reason: 'scraping_disabled_reason',
      url: 'url'
    },
    dbprops:['contributor_count','contributor_count_scraped_at']
  }
}

export type RepoServiceType = keyof typeof repoServiceList
export type RepoPlatform = keyof typeof repositorySettings

export type RepositorySettings={
  id:string
  name: string
  hostname: string[]
  services: RepoServiceType[]
}

export const repositorySettings={
  github:{
    id: 'github',
    name: 'GitHub',
    hostname:['github.com'],
    services: ['commit_history','languages','repo_stats','contributor_cnt']
  },
  gitlab:{
    id: 'gitlab',
    name: 'GitLab',
    hostname:['gitlab.com'],
    services: ['commit_history','languages','repo_stats','contributor_cnt']
  },
  bitbucket:{
    id: 'bitbucket',
    name: 'Bitbucket',
    hostname:['bitbucket.com'],
    services: []
  },
  '4tu':{
    id: '4tu',
    name: '4TU.',
    hostname:['data.4tu.nl'],
    services: ['commit_history','languages','contributor_cnt']
  },
  codeberg:{
    id: 'codeberg',
    name: 'Codeberg',
    hostname:['codeberg.org'],
    services: ['commit_history','languages','repo_stats']
  },
  other:{
    id: 'other',
    name: 'Other',
    hostname:[],
    services:[]
  }
}

export const cfg = {
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
      {label: repositorySettings.github.name, value: 'github'},
      {label: repositorySettings.gitlab.name, value: 'gitlab'},
      {label: repositorySettings.bitbucket.name, value: 'bitbucket'},
      {label: repositorySettings['4tu'].name, value: '4tu'},
      {label: repositorySettings.codeberg.name, value: 'codeberg'},
      {label: repositorySettings.other.name, value: 'other'},
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
  },
  basic_data_last_error:{
    label: 'Basic data last error',
    help: 'Last error from basic data scraper',
    validation: {
      maxLength: {value: 500, message: 'Maximum length is 500'}
    }
  },
  languages_last_error:{
    label: 'Programming languages last error',
    help: 'Last error from programming languages scraper',
    validation: {
      maxLength: {value: 500, message: 'Maximum length is 500'}
    }
  },
  commit_history_last_error:{
    label: 'Commit history last error',
    help: 'Last error from commit history scraper',
    validation: {
      maxLength: {value: 500, message: 'Maximum length is 500'}
    }
  },
  contributor_count_last_error:{
    label: 'Contributor count last error',
    help: 'Last error from contributors scraper',
    validation: {
      maxLength: {value: 500, message: 'Maximum length is 500'}
    }
  }
}
