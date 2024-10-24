// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextApiRequest, NextApiResponse} from 'next'
import {isProperUrl} from '~/utils/fetchHelpers'
import {getRemoteMarkdown} from '~/utils/getSoftware'
import logger from '~/utils/logger'

const GITHUB = new RegExp(/^http?s:\/\/github.com\//g)
const HTML = new RegExp(/<html[^>]*>([\s\S]*?)<\/html>/i)
const BITBUCKET = new RegExp(/^http?s:\/\/bitbucket(.org|.com)\//)

function suggestRawMarkdownUrl(url:string){

  // GitHub
  if (GITHUB.test(url)){
    const rawUrl = url
      .replaceAll(GITHUB,'https://raw.githubusercontent.com/')
      .replace(/\/blob\//g,'/refs/heads/')

    return rawUrl
  }

  // BITBUCKET
  if (BITBUCKET.test(url)){
    const rawUrl = url.replace(/\/src\//,'/raw/')
    return rawUrl
  }

  // Gitlab & on premise ?
  const rawUrl = url.replace(/\/blob\//g,'/raw/')

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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.query.url as string

    // validation 1: url should be string
    if (url === undefined || Array.isArray(url)) {
      // we return 200 to api call
      // and the error as json body
      res.status(200)
      res.json({
        status: 400,
        message: 'Missing url as query parameter'
      })
    }

    // validation 2: check if url syntax is correct
    if (isProperUrl(url)===false){
      // we return 200 to api call
      // and the error as json body
      res.status(200)
      res.json({
        status: 400,
        message: 'Not a valid url. Please validate your input.'
      })
    }

    // get markdown from URL
    const rawMarkdown = await getRemoteMarkdown(url)

    if (typeof rawMarkdown === 'string'){
      // if HTML returned
      if (HTML.test(rawMarkdown)){
        const rawUrl = suggestRawMarkdownUrl(url)
        // we return 200 to api call
        // and the error as json body
        res.status(200)
        // we send 400 error and raw url suggestion
        res.json({
          status:400,
          message:'HTML page, not a raw text/markdown content.',
          rawUrl
        })
      }else{
        // assuming text/markdown returned
        res.status(200)
        res.json({status:200,message:rawMarkdown})
      }
    }else{
      // we return 200 to api call
      // and the error as json body
      res.status(200)
      // pass error returned from fetch
      res.json({
        status: rawMarkdown.status,
        message: rawMarkdown.message
      })
    }
  } catch (e: any) {
    // we return 200 to api call
    // and the error as json body
    res.status(200)
    res.json({
      status: 500,
      message: e.message ?? 'Unknown server error'
    })
    logger(`api/fe/markdown/raw: ${e.message}`)
  }
}
