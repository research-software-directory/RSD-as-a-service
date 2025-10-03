// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {getProjectList} from '~/components/projects/apiProjects'
import {projectListUrl} from '~/utils/postgrestUrl'

export type GetProjectListParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string,
  orderBy?:string,
}

export async function getProjectItems({page,rows,searchFor,orderBy,token}:GetProjectListParams){

  const url = projectListUrl({
    baseUrl: getBaseUrl(),
    search: searchFor,
    order: orderBy,
    limit: rows,
    offset: page * rows
  })

  const resp = getProjectList({url,token})

  return resp
}

type DeleteProjectProps={
  id:string,
  token:string
}

export async function deleteProjectById({id,token}:DeleteProjectProps){
  try{
    const url=`${getBaseUrl()}/rpc/delete_project`

    // DELETE project using POST method!!!
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
    logger(`deleteProjectById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
