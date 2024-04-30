// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {RsdAccountInfo} from './useRsdAccounts'

type getLoginApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?:string
  adminsOnly: boolean,
  inactiveDays: number
}

export async function getRsdAccounts({page,rows,token,searchFor,adminsOnly,inactiveDays}:getLoginApiParams) {
  try {
    // pagination
    let query = `select=id,login_for_account(id,provider,name,email,home_organisation,last_login_date),login_for_account_text_filter:login_for_account!inner(),login_for_account_inactivity_filter:login_for_account!inner(),admin_account!${adminsOnly ? 'inner' : 'left'}(account_id)${paginationUrlParams({rows, page})}`
    if (inactiveDays > 0) {
      const then = new Date()
      then.setDate(then.getDate() - inactiveDays)
      query += `&login_for_account_inactivity_filter.or=(last_login_date.is.null,last_login_date.lt.${then.toISOString()})`
    }
    // search
    if (searchFor) {
      if (searchFor.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) !== null) {
        // if searchFor is uuid we search by account id
        query += `&id=eq.${searchFor}`
      } else {
        // else we search by name, email or organisation
        query+=`&login_for_account_text_filter.or=(name.ilike.*${searchFor}*,email.ilike.*${searchFor}*,home_organisation.ilike.*${searchFor}*)`
      }
    }
    // complete url
    const url = `${getBaseUrl()}/account?${query}`

    // console.group('getRsdAccounts')
    // console.log('url...', url)
    // console.groupEnd()

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

export async function addRsdAdmin({id,token}:{ id: string, token: string }){
  try {

    const url = `${getBaseUrl()}/admin_account`

    const resp = await fetch(url,{
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        account_id: id
      })
    })
    return await extractReturnMessage(resp)
  } catch (e:any) {
    logger(`addRsdAdmin: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function removeRsdAdmin({id,token}:{ id: string, token: string }){
  try {
    if (!id) return {
      status: 400,
      message: 'User account_id not provided'
    }

    const query=`account_id=eq.${id}`
    const url = `${getBaseUrl()}/admin_account?${query}`

    const resp = await fetch(url,{
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })
    return await extractReturnMessage(resp)
  } catch (e:any) {
    logger(`removeRsdAdmin: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

