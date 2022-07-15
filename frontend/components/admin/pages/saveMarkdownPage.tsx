import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {MarkdownPage} from './useMarkdownPages'

export async function saveMarkdownPage({page,token}:{page:MarkdownPage,token:string}) {
  try {
    const query = `meta_pages?id=eq.${page.id}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(page)
    })
    return extractReturnMessage(resp, page.id)
  } catch (e: any) {
    logger(`saveMarkdownPage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchMarkdownData({id,data,token}:{id:string,data:any,token:string}) {
  try {
    const query = `meta_pages?id=eq.${id}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`saveMarkdownPage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
