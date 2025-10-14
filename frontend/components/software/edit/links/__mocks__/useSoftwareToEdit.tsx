// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockEditSoftware from './useSoftwareToEditData.json'

/* eslint-disable @typescript-eslint/no-unused-vars */

const useSoftwareToEdit=jest.fn(({slug, token}: {slug: string, token: string})=>{
  return {
    slug,
    loading:false,
    editSoftware:mockEditSoftware,
    setEditSoftware: jest.fn
  }
})

export default useSoftwareToEdit
