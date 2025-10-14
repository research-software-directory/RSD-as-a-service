// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockKeywordsList from './org_project_keywords_filter.json'

const useOrgProjectKeywordsList=jest.fn(()=>{
  // console.log('useOrgProjectKeywordsList...default mock')
  return {
    keywordsList:mockKeywordsList
  }
})

export default useOrgProjectKeywordsList
