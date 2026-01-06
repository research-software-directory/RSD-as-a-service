// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockData from './useProjectToEditData.json'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useProjectToEdit=jest.fn(({slug, token}:
{slug: string, token: string, reload?: boolean})=>{

  // console.group('useProjectToEdit...MOCK')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.group()

  mockData.slug = slug

  return {
    loading:false,
    project: mockData
  }
})

export default useProjectToEdit
