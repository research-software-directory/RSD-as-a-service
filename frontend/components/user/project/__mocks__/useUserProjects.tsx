// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockProjectsByMaintainer from './projectsByMaintainer.json'

export default function useUserProjects() {

  return {
    projects: mockProjectsByMaintainer,
    count: mockProjectsByMaintainer.length,
    loading: false
  }
}
