// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type ProjectKeyword = {
  // UUID
  project: string,
  // UUID
  keyword: string
}

export type KeywordItem = {
  id: string,
  value: string
}

export async function createKeyword({keyword, token}: {keyword: string, token: string}) {
  try {
    // POST
    const url = '/api/v1/keyword'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        value: keyword.trim()
      })
    })
    if (resp.status === 201) {
      const json:KeywordItem[] = await resp.json()
      return {
        status: 201,
        message: json[0]
      }
    }
    // debugger
    return extractReturnMessage(resp, keyword ?? '')
  } catch (e: any) {
    logger(`createKeyword: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function createOrGetKeyword({keyword, token}: {keyword: string, token: string}) {
  try {
    // try to find keyword
    const url = '/api/v1/keyword'
    const find = `${url}?value=eq.${keyword.trim()}`
    const resp = await fetch(find, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status === 200) {
      const json: KeywordItem[] = await resp.json()
      if (json.length > 0) {
        return {
          status: 201,
          message: json[0]
        }
      }
    }
    // if not found create new
    return createKeyword({keyword,token})
  } catch (e:any) {
    logger(`createOrGetKeyword: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function silentKeywordDelete({keyword, token}: {keyword: string, token: string}) {
  try {
    // try to find keyword
    const url = `/api/v1/keyword?value=eq.${keyword}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, keyword)
  } catch (e: any) {
    logger(`silentKeywordDelete: ${e?.message}`, 'warn')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addKeywordsToProject({data, token}:
{data: ProjectKeyword[], token: string}) {
  try {
    // POST
    const url = '/api/v1/keyword_for_project'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addKeywordToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteKeywordFromProject({project, keyword, token}:
{project: string, keyword: string, token: string}) {
  try {
    // DELETE record based on project and keyword uuid
    const query = `keyword_for_project?project=eq.${project}&keyword=eq.${keyword}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`deleteKeywordFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

type SoftwareKeyword = {
  software: string
  keyword: string
}

export async function addKeywordsToSoftware({data, token}:
{data: SoftwareKeyword | SoftwareKeyword[], token: string}) {
  try {
    // POST
    const url = '/api/v1/keyword_for_software'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addKeywordsToSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteKeywordFromSoftware({software, keyword, token}:
{software: string, keyword: string, token: string}) {
  try {
    // DELETE record based on software and keyword uuid
    const query = `keyword_for_software?software=eq.${software}&keyword=eq.${keyword}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, software ?? '')
  } catch (e: any) {
    logger(`deleteKeywordFromSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
