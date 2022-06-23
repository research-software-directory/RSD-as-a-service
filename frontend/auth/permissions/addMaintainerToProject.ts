// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function getSlugForProject({project, token, frontend=false}:
  { project: string, token: string,frontend?:boolean }) {
  const query = `project?select=slug,title&id=eq.${project}`
  let url = `${process.env.POSTGREST_URL}/${query}`
  if (frontend === true) {
    url = `/api/v1/${query}`
  }
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
      'Accept': 'application/vnd.pgrst.object + json',
    }
  })
  if (resp.status === 200) {
    const json = await resp.json()
    return json
  } else {
    throw new Error(`${resp.status}: ${resp.statusText}. Failed to retreive slug for project ${project}`)
  }
}


export async function addMaintainerToProject({project, account, token, frontend = false}:
  { project: string, account: string, token: string, frontend: boolean }) {
  try {
    const query ='maintainer_for_project'
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        maintainer: account,
        project,
      })
    })
    // Added as MAINTAINER
    if ([200, 201].includes(resp.status)) {
      // get slug
      const projectInfo = await getSlugForProject({
        project,
        token,
        frontend
      })
      return {
        error: null,
        projectInfo
      }
    }
    // ERRORS AS NOT MAINTAINER
    logger(`addMaintainerToProject failed: ${resp.status}:${resp.statusText}`, 'error')
    return {
      error: {
        status: resp.status,
        message: resp.statusText
      },
      projectInfo: null
    }
  } catch (e: any) {
    logger(`addMaintainerToProject failed: ${e?.message}`, 'error')
    return {
      error: {
        status: 500,
        message: e?.message
      },
      projectInfo: null
    }
  }
}
