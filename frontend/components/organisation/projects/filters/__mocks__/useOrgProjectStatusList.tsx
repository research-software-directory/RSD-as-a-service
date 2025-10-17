// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockStatusList from './org_project_status_filter.json'

const useOrgProjectStatusList=jest.fn(()=>{
  // console.log('useOrgProjectStatusList...default mock')
  return {
    statusList: mockStatusList
  }
})

export default useOrgProjectStatusList
