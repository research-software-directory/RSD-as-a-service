// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareServices} from './apiSoftwareServices'

type ServiceListProps={
  name: string,
  desc: string,
  props:{
    scraped_at: keyof SoftwareServices,
    last_error: keyof SoftwareServices,
    url: keyof SoftwareServices
  },
  dbprops: string[]
}

export const repoServiceList:ServiceListProps[]=[{
  name: 'Commit history',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'commit_history_scraped_at',last_error:'commit_history_last_error',url:'url'},
  dbprops: ['commit_history','commit_history_scraped_at']
},{
  name: 'Programming languages',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'languages_scraped_at',last_error:'languages_last_error',url:'url'},
  dbprops: ['languages','languages_scraped_at']
},{
  name: 'Repository statistics',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'basic_data_scraped_at',last_error:'basic_data_last_error',url:'url'},
  dbprops: ['star_count', 'fork_count', 'open_issue_count', 'contributor_count','basic_data_scraped_at']
}]


export const config = {
  repository:{
    title: 'Software repository',
    subtitle: 'Additional information extracted using the source code repository URL'
  },
  package_managers:{
    title: 'Package managers',
    subtitle: 'Additional information extracted using package manager URL'
  }
}
