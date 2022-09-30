import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type PatchProjectInfoProp = {
  id: string,
  variable: string,
  value: any,
  token: string
}

export async function patchProjectInfo({id,variable,value,token}:PatchProjectInfoProp) {
  try {
    const url = `/api/v1/project?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify({
        [variable]:value
      })
    })

    // debugger
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchProjectInfo failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

type PatchProjectTableProp = {
  id: string,
  data: {},
  token: string
}

export async function patchProjectTable({id, data, token}: PatchProjectTableProp) {
  try {
    const url = `/api/v1/project?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })

    // debugger
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchProjectInfo failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
