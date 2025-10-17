// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const useAnnouncement=jest.fn(()=>{
  // console.log('useAnnouncement...MOCK')
  return {
    loading: true,
    announcement: null
  }
})

export default useAnnouncement
