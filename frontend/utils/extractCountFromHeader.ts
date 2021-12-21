import logger from './logger'

export function extractCountFromHeader(headers:Headers){
  try{
    const stats = headers.get('Content-Range')
    if (stats){
      // example postgREST return string
      // 0-11/190 -> items 0 to 11 of 190
      const splitted = stats.split('/')
      if (splitted.length > 0){
        const count = parseInt(splitted[1])
        return count
      }
      return null
    }
    return null
  }catch(e:any){
    logger(`extractCountFromHeader: ${e?.message}`,'error')
    return null
  }
}
