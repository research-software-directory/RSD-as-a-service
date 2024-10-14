// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'

export async function removeOrganisationCategoriesFromProject(
  projectId: string,
  organisationId: string,
  token: string
){
  const url = `${getBaseUrl()}/rpc/delete_organisation_categories_from_project`
  const body = JSON.stringify({project_id: projectId, organisation_id: organisationId})

  const resp = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return resp.ok ? null : resp.text()
}

export async function getCategoryListForProject(project_id: string, token?: string){
  try {
    const query = `project_id=eq.${project_id}`
    const url = `${getBaseUrl()}/category_for_project?select=category_id&${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data = await resp.json()
      const categories:Set<string> = new Set(data.map((entry: any) => entry.category_id))
      return categories
    } else {
      logger(`getCategoryListForProject: ${resp.status} [${url}]`, 'error')
      throw new Error('Couldn\'t load the categories for this project')
    }
  } catch (e: any) {
    logger(`getCategoryListForProject: ${e?.message}`, 'error')
    throw e
  }
}
