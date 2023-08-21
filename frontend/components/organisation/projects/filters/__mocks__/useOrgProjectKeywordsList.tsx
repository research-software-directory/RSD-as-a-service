// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockKeywordsList from './org_project_keywords_filter.json'

export default function useOrgProjectKeywordsList() {
  // console.log('useOrgProjectKeywordsList...default mock')
  return {
    keywordsList:mockKeywordsList
  }
}
