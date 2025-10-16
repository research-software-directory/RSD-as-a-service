// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {type NextRequest} from 'next/server'
import logger from '~/utils/logger'
import {isProperUrl} from '~/utils/fetchHelpers'
import {getRemoteMarkdown} from '~/components/software/apiSoftware'

const GITHUB = new RegExp(/^http?s:\/\/github.com\//g)
const HTML = new RegExp(/<html[^>]*>([\s\S]*?)<\/html>/i)
const BITBUCKET = new RegExp(/^http?s:\/\/bitbucket(.org|.com)\//)

function suggestRawMarkdownUrl(url:string){

  // GitHub
  if (GITHUB.test(url)){
    const rawUrl = url
      .replaceAll(GITHUB,'https://raw.githubusercontent.com/')
      .replace(/\/blob\//g,'/refs/heads/') // NOSONAR

    return rawUrl
  }

  // BITBUCKET
  if (BITBUCKET.test(url)){
    const rawUrl = url.replace(/\/src\//,'/raw/')
    return rawUrl
  }

  // Gitlab & on premise ?
  const rawUrl = url.replace(/\/blob\//g,'/raw/') // NOSONAR

  if (rawUrl!==url){
    return rawUrl
  }
}

/**
 * Endpoint to retrieve raw markdown.
 * It checks if the provided url returns raw markdown content or HTML page.
 * For github.com and gitlab com provides suggestion for correct raw markdown url. *
 * Examples
 * https://github.com/research-software-directory/RSD-as-a-service/blob/main/README.md
 * https://raw.githubusercontent.com/research-software-directory/RSD-as-a-service/refs/heads/main/README.md
 * https://gitlab.com/dmijatovic/nexter-demo/-/blob/master/README.md?ref_type=heads
 * https://gitlab.com/dmijatovic/nexter-demo/-/raw/master/README.md?ref_type=heads
 * https://bitbucket.org/dmijatovic/publictest/src/main/README.md
 * https://bitbucket.org/dmijatovic/publictest/raw/85e8651f290d058ad7832d09efa2fd63873b648b/README.md
 * @param req
 * @param res
 */
export async function GET(request: NextRequest) {
  try{
    // extract parameters
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    // validation 1: url should be string
    if (!url || Array.isArray(url)){
      return Response.json({
        'status': 400,
        'message':'Url param (url) missing or array. Url should be string.'
      },{
        status: 200,
        statusText: 'OK'
      })
    }

    // validation 2: check if url syntax is correct
    if (isProperUrl(url)===false){
      return Response.json({
        'status': 400,
        'message': 'Not a valid url. Please validate your input.'
      },{
        status: 200,
        statusText: 'OK'
      })
    }

    // get markdown from URL
    const rawMarkdown = await getRemoteMarkdown(url)

    if (typeof rawMarkdown === 'string'){
      // if HTML returned
      if (HTML.test(rawMarkdown)){
        const rawUrl = suggestRawMarkdownUrl(url)
        // we return 200 to api call
        // we send 400 error and raw url suggestion in json body
        return Response.json({
          'status': 400,
          'message': 'HTML page, not a raw text/markdown content.',
          'rawUrl': rawUrl
        },{
          status: 200,
          statusText: 'OK'
        })
      }else{
        // assuming text/markdown returned
        return Response.json({
          'status': 200,
          'message': rawMarkdown
        })
      }
    }else{
      // pass error returned from fetch
      return Response.json({
        'status': rawMarkdown.status,
        'message': rawMarkdown.message
      })
    }

  }catch(e:any){
    logger(`GET api/fe/cite: ${e.message}`,'error')
    // unexpected error
    return Response.json({
      'status': 500,
      'message': e.message ?? 'Unknown server error'
    },{
      status: 200,
      statusText: 'OK'
    })
  }
}
