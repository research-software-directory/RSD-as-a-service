// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockEditSoftware from './useSoftwareTableData.json'

/* eslint-disable @typescript-eslint/no-unused-vars */

const useSoftwareTable=jest.fn(async({slug, token}: {slug: string|null, token: string})=>{
  return {
    slug,
    loading:false,
    editSoftware: mockEditSoftware,
    setEditSoftware: jest.fn
  }
})

export default useSoftwareTable
