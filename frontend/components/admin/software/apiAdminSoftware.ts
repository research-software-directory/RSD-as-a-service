// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {getSoftwareList} from '~/components/software/apiSoftware'

export type GetSoftwareListParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string,
  orderBy?:string,
}

export async function getSoftwareItems({page,rows,searchFor,orderBy,token}:GetSoftwareListParams){

  const url = softwareListUrl({
    baseUrl: getBaseUrl(),
    search: searchFor,
    order: orderBy,
    limit: rows,
    offset: page * rows
  })

  const resp = getSoftwareList({url,token})

  return resp
}

type DeleteSoftwareProps={
  id:string,
  token:string
}

export async function deleteSoftwareById({id,token}:DeleteSoftwareProps){
  try{
    const url=`${getBaseUrl()}/rpc/delete_software`

    // DELETE software using POST method!!!
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token)
      },
      body:JSON.stringify({
        id
      })
    })

    return extractReturnMessage(resp, '')

  }catch(e:any){
    logger(`deleteSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
