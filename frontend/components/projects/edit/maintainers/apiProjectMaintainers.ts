// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {RawMaintainerProps} from '~/components/maintainers/apiMaintainers'

export async function getMaintainersOfProject({project, token}:
{project: string, token: string}) {
  try {
    const query = `rpc/maintainers_of_project?project_id=${project}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json:RawMaintainerProps[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfProject: ${resp.status}:${resp.statusText} project: ${project}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfProject: ${e?.message}`, 'error')
    return []
  }
}

export async function deleteMaintainerFromProject({maintainer,project,token}:
{maintainer:string,project:string,token:string}) {
  try {
    const query = `maintainer_for_project?maintainer=eq.${maintainer}&project=eq.${project}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`deleteMaintainerFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
