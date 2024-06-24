// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import communitiesByMaintainer from './communitiesByMaintainer.json'

export default function useUserCommunities() {

  return {
    communities: communitiesByMaintainer,
    loading: false
  }
}
