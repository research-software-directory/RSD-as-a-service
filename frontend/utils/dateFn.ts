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

export function formatDateToStr(date: Date|undefined, locale = 'en-US',
  options = defaultDateFormattingOptions): string {
  if (date) {
    return date.toLocaleDateString(locale, options)
  }
  return ''
}

/**
 * Get human readible time difference like: right now, X hours ago, X days ago etc..
 * @param isoString
 * @param since
 * @returns
 */
export function getTimeAgoSince(since: Date, isoStringDate: string | null) {
  try {
    // if not provided we do not show
    if (!isoStringDate) return null
    // convert to date
    const updated = isoStrToDate(isoStringDate)
    if (!updated) return null

    if (since > updated) {
      const msDiff = since.getTime() - updated.getTime()
      const hours = 1000 * 60 * 60
      const hoursDiff = Math.floor(msDiff / hours)
      if (hoursDiff > 24) {
        const daysDiff = Math.floor(hoursDiff / 24)
        if (daysDiff > 30) {
          const monthDiff = Math.floor(daysDiff / 30)
          return `${monthDiff} months ago`
        }else if (daysDiff > 7) {
          const weeksDiff = Math.floor(daysDiff / 7)
          return `${weeksDiff} weeks ago`
        } else if (daysDiff > 1) return `${daysDiff} days ago`
        return '1 day ago'
      } else if (hoursDiff === 1) {
        return '1 hour ago'
      } else {
        return `${hoursDiff} hours ago`
      }
    } else {
      return 'right now'
    }
  } catch (e) {
    // on fail return nothing
    return null
  }
}
