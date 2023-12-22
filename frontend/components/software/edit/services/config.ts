// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
  }
}

export const repoServiceList:ServiceListProps[]=[{
  name: 'Commit hisitory',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'commit_history_scraped_at',last_error:'commit_history_last_error',url:'url'}
},{
  name: 'Programming languages',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'languages_scraped_at',last_error:'languages_last_error',url:'url'}
},{
  name: 'Repository stats',
  desc: 'Information is extracted from the repository api (github/gitlab)',
  props:{scraped_at:'basic_data_scraped_at',last_error:'basic_data_last_error',url:'url'}
}]
