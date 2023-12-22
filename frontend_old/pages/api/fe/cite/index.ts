// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {extractParam, Error} from '~/utils/apiHelpers'
import logger from '../../../../utils/logger'
import {citationOptions} from '~/components/software/citationFormats'

type Data = {
  name: string,
  version:string,
  id:string,
  format:string,
  data:string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data|Error>
){
  try{
    // extract query parameters
    const doi = extractParam(req,'doi')
    const format = extractParam(req,'f')
    const name = extractParam(req, 'n')

    // validate download format
    if (citationOptions.hasOwnProperty(format) === false) {
      logger(`NextApi.v1.cite: uknown format ${format}`, 'error')
      // query not found
      res.status(400).json({
        message: `Download format ${format} NOT SUPPORTED!`
      })
    }

    const contentType = citationOptions[format].contentType

    // console.log('contentType...',contentType)

    // make request to postgREST api
    const url = `https://doi.org/${doi}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': contentType
      }
    })

    // send reponse back
    if (resp.status===200){
      const data:any = await resp.text()
      // add reponse headers
      res.setHeader('Content-Disposition',`attachment; filename=${name}`)
      res.setHeader('Content-Type', contentType)
      // send content
      res.status(200).send(data)
    } else if (resp.status===404){
      logger(`NextApi.v1.cite: 404 [${url}]`,'error')
      // query not found
      res.status(404).json({
        message:'File not found!'
      })
    } else {
      // forward postgREST response
      res.status(resp.status).json({
        message: resp.statusText
      })
    }
  }catch(e:any){
    logger(`NextApi.v1.cite: ${e?.message}`)
    res.status(500).json({
      message:`Failed to get citation file: ${e?.message}`
    })
  }
}
