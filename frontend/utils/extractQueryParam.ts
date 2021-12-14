import type { NextApiRequest} from 'next'
import logger from './logger'

export function extractQueryParam({req,param,castToType,defaultValue}:{
  req:NextApiRequest, param:string, castToType:("string"|"number"|"date"),
  defaultValue:any
}){
try{
  if (req?.query && req.query.hasOwnProperty(param)){
    const rawVal = req.query[param]
    switch (castToType){
      case "number":
        return parseInt(rawVal?.toString())
      case "date":
        return new Date(rawVal?.toString())
      case "string":
      default:
        return rawVal?.toString()
    }
  }else{
    // return default value
    // when parameter not available
    return defaultValue
  }
}catch(e:any){
  logger(`extractQueryParam: ${e.description}`,"error")
  throw e
}}