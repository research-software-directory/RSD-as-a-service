// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {RsdAccountInfo} from './useRsdAccounts'
import {LockAccountProps} from './LockUserModal'
import {orcidRegex} from '~/utils/getORCID'

type getLoginApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?:string
  adminsOnly: boolean,
  lockedOnly: boolean
  inactiveDays: number
}

export async function getRsdAccounts({page,rows,token,searchFor,adminsOnly,lockedOnly,inactiveDays}:getLoginApiParams) {
  try {
    // pagination
    let query = 'select=id,login_for_account(id,provider,name,email,home_organisation,last_login_date),login_for_account_text_filter:login_for_account!inner(),login_for_account_inactivity_filter:login_for_account!inner()'
    query += `,admin_account!${adminsOnly ? 'inner' : 'left'}(account_id),locked_account!${lockedOnly ? 'inner' : 'left'}(*)${paginationUrlParams({rows, page})}`

    if (inactiveDays > 0) {
      const then = new Date()
      then.setDate(then.getDate() - inactiveDays)
      query += `&login_for_account_inactivity_filter.or=(last_login_date.is.null,last_login_date.lt.${then.toISOString()})`
    }
    // search
    if (searchFor) {
      if (/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(searchFor)) {
        // if searchFor is a UUID we search by account ID
        query += `&id=eq.${searchFor}`
      } else if (orcidRegex.test(searchFor)) {
        // else if searchFor is an ORCID we search on login_for_account sub
        query += `&login_for_account_text_filter.sub=eq.${searchFor}&login_for_account_text_filter.provider=eq.orcid`
      } else {
        const encodedSearch = encodeURIComponent(searchFor)
        // else we search by name, email or organisation
        query += `&login_for_account_text_filter.or=(name.ilike."*${encodedSearch}*",email.ilike."*${encodedSearch}*",home_organisation.ilike."*${encodedSearch}*")`
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

export async function deleteRsdAccount({id,token}:{id: string, token: string}) {
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

export async function addRsdAdmin({id,token}:{id: string, token: string}){
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

export async function removeRsdAdmin({id,token}:{id: string, token: string}){
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

export async function lockRsdAcount({
  account,token
}:{
  account:LockAccountProps, token: string
}){
  try {
    if (!account.id) return {
      status: 400,
      message: 'User account_id not provided'
    }

    const tableName = 'locked_account'
    const query = `${tableName}?account_id=eq.${account.id}`
    const url = `${getBaseUrl()}/${query}`

    let resp

    if (account.lock_account){
      resp = await fetch(url, {
        method: 'PUT',
        headers: {
          ...createJsonHeaders(token),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          account_id: account.id,
          // use null instead of empty string
          admin_facing_reason: account.admin_facing_reason?.trim() || null,
          user_facing_reason: account.user_facing_reason?.trim() || null,
        }),
      })
    } else {
      resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...createJsonHeaders(token)
        }
      })
    }
    return await extractReturnMessage(resp)
  } catch (e:any) {
    logger(`removeRsdAdmin: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

