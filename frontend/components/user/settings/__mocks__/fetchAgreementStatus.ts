// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// DEFAULT MOCK with terms accepted
export async function fetchAgreementStatus(token: string, account: string) {
  return Promise.resolve({
    status:200,
    data: {
      agree_terms: true,
      notice_privacy_statement: true
    }
  })
}
