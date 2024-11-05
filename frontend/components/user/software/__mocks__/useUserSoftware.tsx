// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockSoftwareByMaintainer from './softwareByMaintainer.json'

export default function useUserSoftware() {

  return {
    software: mockSoftwareByMaintainer,
    loading: false
  }
}
