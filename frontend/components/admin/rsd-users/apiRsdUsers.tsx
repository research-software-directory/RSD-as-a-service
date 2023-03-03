// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'


export type RsdAccountInfo = {
  id: string,
  login_for_account: LoginForAccount[]
}

export type LoginForAccount = {
  id: string,
  provider: string,
  name: string|null,
  email: string | null,
  home_organisation: string | null,
}

type getLoginApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?:string
}

export async function getRsdAccounts({page,rows,token,searchFor}:getLoginApiParams) {
  try {
    // pagination
    let query = `select=id,login_for_account!inner(id,provider,name,email,home_organisation)${paginationUrlParams({rows, page})}`
    // search
    if (searchFor) {
      if (searchFor.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) !== null) {
        // if searchFor is uuid we search by account id
        query += `&id=eq.${searchFor}`
      } else {
        // else we search by name, email or organisation
        query+=`&login_for_account.or=(name.ilike.*${searchFor}*,email.ilike.*${searchFor}*,home_organisation.ilike.*${searchFor}*)`
      }
    }
    // complete url
    const url = `${getBaseUrl()}/account?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const accounts: RsdAccountInfo[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        accounts
      }
    }
    logger(`getRsdAccounts: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      accounts: []
    }
  } catch (e:any) {
    logger(`getRsdAccounts: ${e.message}`,'error')
    return {
      count: 0,
      accounts: []
    }
  }
}

export async function deleteRsdAccount({id,token}:{ id: string, token: string }) {
  try {

    const url = `${getBaseUrl()}/rpc/delete_account`

    const resp = await fetch(url,{
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        account_id: id
      })
    })
    return await extractReturnMessage(resp)
  } catch (e:any) {
    logger(`deleteRsdAccount: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export function useLoginForAccount(token: string) {
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
