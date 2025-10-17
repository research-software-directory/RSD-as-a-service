// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const useLoginProviders=jest.fn(()=>{
  return {
    providers:[{
      name: 'test provider',
      signInUrl: 'https://test-login-redirect.com',
      accessType: 'EVERYONE',
      openidProvider: 'local'
    }],
    setProviders: jest.fn()
  }
})

export default useLoginProviders
