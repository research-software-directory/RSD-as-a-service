// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {deleteRsdAccount, getRsdAccounts} from './apiRsdUsers'

export type LoginForAccount = {
  id: string,
  provider: string,
  name: string|null,
  email: string | null,
  home_organisation: string | null,
}

export type RsdAccountInfo = {
  id: string,
  login_for_account: LoginForAccount[]
}

export default function useLoginForAccount(token: string) {
  const {showErrorMessage}=useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find user by account id (exact match) or by name, email or affiliation (partial match)')
  const [accounts, setAccounts] = useState<RsdAccountInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getLogins() {
      setLoading(true)
      const {accounts, count} = await getRsdAccounts({
        token,
        searchFor,
        page,
        rows
      })
      setAccounts(accounts)
      setCount(count)
      setLoading(false)
    }
    if (token) {
      getLogins()
    }
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,searchFor,page,rows])


  async function deleteAccount(id: string) {
    const resp = await deleteRsdAccount({
      id,
      token
    })
    if (resp.status===200) {
      const newList = accounts.filter(item => item.id !== id)
      setAccounts(newList)
    } else {
      showErrorMessage(`Failed to remove account ${id}. ${resp.message}`)
    }
  }

  return {
    loading,
    accounts,
    deleteAccount
  }
}
