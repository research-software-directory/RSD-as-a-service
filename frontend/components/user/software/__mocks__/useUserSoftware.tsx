// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockSoftwareByMaintainer from './softwareByMaintainer.json'

const useUserSoftware=jest.fn(()=>{
  return {
    software: mockSoftwareByMaintainer,
    loading: false
  }
})

export default useUserSoftware
