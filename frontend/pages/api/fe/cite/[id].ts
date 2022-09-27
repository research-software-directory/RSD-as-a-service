// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {extractParam, Error} from '~/utils/apiHelpers'
import logger from '../../../../utils/logger'

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
    const id = extractParam(req,'id')
    const format = extractParam(req,'f')
    const type = extractParam(req, 't')
    const name = extractParam(req, 'n')

    // make request to postgREST api
    const url = `${process.env.POSTGREST_URL}/release_content?select=${format}&id=eq.${id}`
    const resp = await fetch(url,{method:'GET'})

    // send reponse back
    if (resp.status===200){
      const data:any[] = await resp.json()
      const content = data[0][format]
      // add reponse headers
      res.setHeader('Content-Disposition',`attachment; filename=${name}`)
      res.setHeader('Content-Type',type)
      // send content
      res.status(200).send(content)
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
