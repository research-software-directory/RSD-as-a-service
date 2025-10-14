// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/** Default mock of getUserSettings */
export const getUserSettings = jest.fn(()=>Promise.resolve({
  rsd_page_layout:'grid',
  rsd_page_rows:12,
  token:'test-token'
}))

