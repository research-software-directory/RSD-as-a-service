// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const useOrgProjectCategoriesList=jest.fn(()=>{
  return {
    hasCategories:false,
    categoryList:[]
  }
})

export default useOrgProjectCategoriesList
