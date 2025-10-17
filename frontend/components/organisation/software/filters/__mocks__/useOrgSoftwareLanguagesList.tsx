// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockLanguageList from './org_software_languages_filter.json'

const useOrgSoftwareLanguagesList=jest.fn(()=>{
  // console.log('useOrgSoftwareLanguagesList...default mock')
  return {
    languagesList:mockLanguageList
  }
})

export default useOrgSoftwareLanguagesList
