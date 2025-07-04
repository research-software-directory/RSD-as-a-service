// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

export function daysDiff(date:Date, direction:'since'|'until'='since'):number|undefined{
  const today = new Date()
  if (date){
    // set time to noon (ignore that diff)
    today.setHours(12,0,0)
    date.setHours(12,0,0)
    // diff in ms
    const dayInMs = 1000 * 60 * 60 * 24
    if (direction === 'since') {
      const diffInMs = today.valueOf() - date.valueOf()
      if (diffInMs >= dayInMs) {
        const daysDiff = Math.floor(diffInMs / dayInMs)
        return daysDiff
      } else {
        return 0
      }
    } else if (direction === 'until') {
      const diffInMs = date.valueOf() - today.valueOf()
      if (diffInMs >= dayInMs) {
        const daysDiff = Math.floor(diffInMs / dayInMs)
        return daysDiff
      } else {
        return 0
      }
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
  try {
    if (isoString) {
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

export function formatDateToIsoStr(date: Date|undefined) {
  if (date) {
    return date.toISOString().split('T')[0]
  }
  return ''
}

/**
 * Get human readable time difference like: right now, X hours ago, X days ago etc..
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
          if (monthDiff === 1) return `${monthDiff} month ago`
          return `${monthDiff} months ago`
        } else if (daysDiff > 7) {
          const weeksDiff = Math.floor(daysDiff / 7)
          if (weeksDiff === 1) return `${weeksDiff} week ago`
          return `${weeksDiff} weeks ago`
        } else if (daysDiff > 1) return `${daysDiff} days ago`
        return '1 day ago'
      } else if (hoursDiff === 1) {
        return '1 hour ago'
      } else if (hoursDiff === 0) {
        return 'right now'
      } else {
        return `${hoursDiff} hours ago`
      }
    } else {
      return 'right now'
    }
  } catch {
    // on fail return nothing
    return null
  }
}


export function getMonthYearDate(date: string, locale = 'en-us') {
  try {
    const monthDate = new Date(date)
    if (monthDate) {
      // return only month and year in us
      return monthDate.toLocaleDateString(locale, {year: 'numeric', month: 'short'})
    }
    return null
  } catch {
    return null
  }
}

/**
 * Calculates the date from now for number of days passed.
 * Pass positive value for dates in the future and negative values for dates in the past.
 */
export function getDateFromNow(days:number){
  const newDate = new Date()
  // change date
  newDate.setDate(newDate.getDate() + days)
  // return changed date
  return newDate
}

/**
 * Returns string of date in the format YYYY-MM-DD
 * @param date
 * @param locale
 * @returns
 */
export function getYearMonthDay(date:Date) {
  // this locale uses desired formatting YYYY-MM-DD
  const locale='fr-CA'
  try {
    // we need to use short formatting to return only date value: YYYY-MM-DD
    return date.toLocaleDateString(locale, {year:'numeric', month:'2-digit', day:'2-digit'})
  } catch {
    return null
  }
}

export function getDatePlaceholderForLocale(locale = navigator.language) {
  const exampleDate = new Date()
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(exampleDate)

  return parts.map((part) => {
    switch (part.type) {
      case 'day':
        return 'DD'
      case 'month':
        return 'MM'
      case 'year':
        return 'YYYY'
      default:
        return part.value
    }
  }).join('')
}
