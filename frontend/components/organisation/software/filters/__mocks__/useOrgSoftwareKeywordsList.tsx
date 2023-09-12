// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockKeywordsList from './org_software_keywords_filter.json'

// DEFAULT MOCK
export default function useOrgSoftwareKeywordsList() {
  // console.log('useOrgSoftwareKeywordsList...default mock')
  return {
    keywordsList: mockKeywordsList
  }
}
