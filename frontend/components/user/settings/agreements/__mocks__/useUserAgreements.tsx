// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// DEFAULT MOCK with terms accepted
export const useUserAgreements=jest.fn(()=>{
  return {
    loading: false,
    agree_terms: true,
    notice_privacy_statement: true,
    public_orcid_profile: true,
    setAgreeTerms: (props:any) => { return props },
    setPrivacyStatement:(props:any) => { return props },
    setPublicOrcidProfile:(props:any) => { return props }
  }
})
