
import logger from './logger'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from './fetchHelpers'
import {NewProject} from '~/types/Project'

// query for software item page based on slug
export async function validProjectItem(slug: string | undefined, token?: string) {
  try {
    // this request is always perfomed from frontend
    const url = `/api/v1/project?select=id,slug&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url, {method: 'GET'})
    }
    if (resp.status === 200) {
      const data = await resp.json()
      return data.length === 1
    }
    return false
  } catch (e: any) {
    logger(`validProjectItem: ${e?.message}`, 'error')
    return false
  }
}

export async function addProject({project, token}:
  { project: NewProject, token: string }) {
  try {
    // console.log('addProject...called...', software)
    const url = '/api/v1/project'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify(project)
    })
    if (resp.status === 201) {
      // no data response
      return {
        status: 201,
        message: project.slug
      }
    }
    // construct message
    const data = await resp.json()
    const message = data?.message ?? resp.statusText
    logger(`addProject: ${message}`, 'warn')
    // return message
    return {
      status: resp.status,
      message
    }
  } catch (e: any) {
    logger(`addProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
