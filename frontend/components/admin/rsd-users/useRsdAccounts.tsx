// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {deleteRsdAccount, getRsdAccounts} from './apiRsdUsers'

export type RsdAccount = {
  id: string,
  provider: string,
  name: string|null,
  email: string | null,
  home_organisation: string | null,
  last_login_date: Date | null,
}

export type RsdAccountInfo = {
  id: string,
  login_for_account: RsdAccount[],
  admin_account: string[] | null
}

export default function useRsdAccounts(token: string, adminsOnly: boolean, inactiveDays: number) {
  const {showErrorMessage}=useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find user by account id, name, email or affiliation')
  const [accounts, setAccounts] = useState<RsdAccountInfo[]>([])
  // show loading only on inital load
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getLogins() {
      const {accounts, count} = await getRsdAccounts({
        token,
        searchFor,
        page,
        rows,
        adminsOnly,
        inactiveDays
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
  }, [token,searchFor,page,rows,adminsOnly,inactiveDays])


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
