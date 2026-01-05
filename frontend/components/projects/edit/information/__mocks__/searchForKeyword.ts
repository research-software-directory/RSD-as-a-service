// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}

// DEFAULT MOCK
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const searchForProjectKeyword=jest.fn(async({searchFor}: {searchFor: string})=>{
  // console.log('searchForProjectKeyword...default MOCK')
  return []
})
