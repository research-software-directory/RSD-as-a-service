// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockStatusList from './org_project_status_filter.json'

export default function useOrgProjectStatusList() {
  // console.log('useOrgProjectStatusList...default mock')
  return {
    statusList: mockStatusList
  }
}
