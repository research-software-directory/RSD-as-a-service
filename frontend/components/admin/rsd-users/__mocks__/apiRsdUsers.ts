// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockAccounts from './account.json'

type getLoginApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
}

export async function getRsdAccounts({page, rows, token, searchFor}: getLoginApiParams) {
  // console.log('getRsdAccounts...mock DEFAULT')

  return {
    count: mockAccounts.length,
    accounts: mockAccounts
  }

}


export async function deleteRsdAccount({id, token}: { id: string, token: string }) {
  // console.log('deleteRsdAccount...mock DEFAULT')

  return {
    status: 200,
    message: 'OK'
  }
}
