import logger from './logger'

export function daysDiff(date:Date):number|undefined{
  const today = new Date()
  if (date){
    // set time to noon (ignore that diff)
    today.setHours(12,0,0)
    date.setHours(12,0,0)
    // diff in ms
    const diffInMs = today.valueOf() - date.valueOf()
    const dayInMs = 1000 * 60 * 60 * 24
    if (diffInMs >= dayInMs) {
      const daysDiff = Math.floor(diffInMs / dayInMs)
      return daysDiff
    } else {
      return 0
    }
  }else{
    return undefined
  }
}

export function olderThanXDays(lastDate:Date, xDays=7):boolean{
  const days = daysDiff(lastDate)
  if (days === undefined) return true
  if (days > xDays) return true
  return false
}

export function isoStrToDate(isoString:string):Date|null{
  try{
    if (isoString){
      const newDate = new Date(isoString)
      return newDate
    }
    return null
  }catch{
    logger(`dateFn.isoStringToDate...FAILED for value:${isoString}`, 'warn')
    return null
  }
}

const defaultDateFormattingOptions:Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export function isoStrToLocalDateStr(isoString: string, locale = 'en-US',
  options = defaultDateFormattingOptions): string{
  const date = isoStrToDate(isoString)
  if (date){
    return date.toLocaleDateString(locale,options)
  }
  return ''
}
