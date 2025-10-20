// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const useOrgSoftwareCategoriesList=jest.fn(()=>{
  return {
    hasCategories: false,
    categoryList: []
  }
})

export default useOrgSoftwareCategoriesList
