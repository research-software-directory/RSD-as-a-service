// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import communitiesByMaintainer from './communitiesByMaintainer.json'

const useUserCommunities=jest.fn(()=>{
  return {
    communities: communitiesByMaintainer,
    loading: false
  }
})

export default useUserCommunities
