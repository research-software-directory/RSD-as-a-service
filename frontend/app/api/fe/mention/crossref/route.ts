// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {type NextRequest} from 'next/server'
import logger from '~/utils/logger'
import {getCrossrefItemByDoi} from '~/utils/getCrossref'
/**
 * GET api/fe/mention/crossref
 */
export async function GET(request: NextRequest) {
  // extract parameters
  const searchParams = request.nextUrl.searchParams
  const doi = searchParams.get('doi')

  if (doi === undefined || Array.isArray(doi)) {
    // doi not found
    return Response.json({
      'status': 400,
      'message': 'Parameter doi missing or not valid'
    },{
      status: 400,
      statusText: 'Parameter doi missing or not valid'
    })
  }
  try {
    const doiResponse = await getCrossrefItemByDoi(doi as string)
    // return response from crossref fn directly
    return Response.json(doiResponse,{
      status: doiResponse.status,
      statusText: doiResponse.status === 200 ? 'OK' : doiResponse.message
    })
  } catch (e:any) {
    // server error 500
    logger(`api/fe/mention/crossref: ${e?.message ?? 'Unknown error'}`,'error')
    return Response.json({
      status: 500,
      message: e?.message ?? 'Unknown error'
    },{
      status: 500,
      statusText: e?.message ?? 'Unknown error'
    })
  }
}
