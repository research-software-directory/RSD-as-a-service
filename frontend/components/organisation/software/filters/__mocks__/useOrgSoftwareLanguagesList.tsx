// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockLanguageList from './org_software_languages_filter.json'

export default function useOrgSoftwareLanguagesList() {
  // console.log('useOrgSoftwareLanguagesList...default mock')
  return {
    languagesList:mockLanguageList
  }
}
