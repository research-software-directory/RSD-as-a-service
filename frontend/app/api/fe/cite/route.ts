// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {type NextRequest} from 'next/server'
import logger from '~/utils/logger'
import {citationOptions} from '~/components/software/citationFormats'

/**
 * This GET request retrieves citation in desired format from doi.org
 * and pass it as downloadable file to the user.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try{
    // extract parameters
    const searchParams = request.nextUrl.searchParams
    const doi = searchParams.get('doi')
    const format = searchParams.get('f')
    const name = searchParams.get('n')

    // console.log('doi...',doi)
    // console.log('format...',format)
    // console.log('name...',name)

    if (!format || !doi || !name){
      // query not found
      return Response.json({
        'message':'One or all (doi,f,n) search params missing'
      },{
        status: 400,
        statusText: 'Parameter doi, f or n is missing'
      })
    }

    // validate download format
    if (citationOptions.hasOwnProperty(format ?? 'undefined') === false) {
      logger(`GET api/fe/cite: unknown format ${format}`, 'error')
      // query not found
      return Response.json({
        'message':`Download format ${format} NOT SUPPORTED!`
      },{
        status: 400,
        statusText: `Download format ${format} NOT SUPPORTED!`
      })
    }

    const contentType = citationOptions[format].contentType

    // fetch DOI org for citation in the requested format
    const url = `https://doi.org/${doi}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': contentType
      }
    })

    // send response back
    if (resp.status===200){
      const data:string = await resp.text()
      // send response with specific headers
      return new Response(data,{
        status: 200,
        headers:{
          ...request.headers,
          'Content-Disposition':`attachment; filename=${name}`,
          'Content-Type': contentType
        }
      })

    } else if (resp.status===404){
      logger(`GET api/fe/cite: 404 [${url}]`,'error')
      // query not found
      return Response.json({
        'message':'File not found!'
      },{
        status: 404,
        statusText: 'File not found!'
      })

    } else {
      logger(`GET api/fe/cite: ${resp.status} ${resp.statusText} [${url}]`,'warn')
      // forward response status
      return Response.json({
        'message': `${resp.status} ${resp.statusText}`
      },{
        status: resp.status,
        statusText: resp.statusText
      })
    }

  }catch(e:any){
    logger(`GET api/fe/cite: ${e.message}`,'error')
    // unexpected error
    return Response.json({
      'message': `500: ${e?.message}`
    },{
      status: 500,
      statusText: e?.message ?? 'Unexpected server error'
    })
  }
}
