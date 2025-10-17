// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockKeywordsList from './org_software_keywords_filter.json'

// DEFAULT MOCK
const useOrgSoftwareKeywordsList=jest.fn(()=>{
  // console.log('useOrgSoftwareKeywordsList...default mock')
  return {
    keywordsList: mockKeywordsList
  }
})

export default useOrgSoftwareKeywordsList
