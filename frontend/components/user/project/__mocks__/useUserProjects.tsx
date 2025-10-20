// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockProjectsByMaintainer from './projectsByMaintainer.json'

const useUserProjects=jest.fn(()=>{
  return {
    projects: mockProjectsByMaintainer,
    count: mockProjectsByMaintainer.length,
    loading: false
  }
})

export default useUserProjects
