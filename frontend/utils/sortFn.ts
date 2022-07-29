// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

/**
 * Array sorting functions for array of objects.
*/

export function sortOnStrProp(itemA: any, itemB: any, prop: string, sortDir: 'asc' | 'desc' = 'asc') {
  try {
    // ignore case
    const nameA = itemA[prop].toUpperCase()
    const nameB = itemB[prop].toUpperCase()
    return sortItems(nameA,nameB,sortDir)
  } catch (e: any) {
    // on error we log and return neutral score
    logger(`sortOnStrProp failed. Error: ${e.message}`)
    return 0
  }
}

export function sortOnDateProp(itemA: any, itemB: any, prop: string, sortDir: 'asc' | 'desc' = 'asc'){
  const dateA = new Date(itemA[prop]).getTime() || 0
  const dateB = new Date(itemB[prop]).getTime() || 0

  return sortItems(dateA,dateB,sortDir)
}

export function sortOnNumProp(itemA: any, itemB: any, prop: string, sortDir: 'asc' | 'desc' = 'asc'){
  const valA = itemA[prop]
  const valB = itemB[prop]
  return sortItems(valA,valB,sortDir)
}

function sortItems(valA: any, valB: any, sortDir: 'asc' | 'desc' = 'asc'){
  if (valA < valB) {
    if (sortDir === 'asc'){
      return -1
    }
    return 1
  }

  if (valA > valB) {
    if (sortDir === 'asc'){
      return 1
    }
    return -1
  }
  // values are equal
  return 0
}


export function sortBySearchFor(itemA: any, itemB: any, prop: string, searchFor:string) {
  const valA:string = itemA[prop]
  const valB:string = itemB[prop]

  if (
    valA.toLowerCase().startsWith(searchFor.toLowerCase()) === true &&
    valB.toLowerCase().startsWith(searchFor.toLowerCase()) === false
  ) {
    return -1
  }

  if (
    valA.toLowerCase().startsWith(searchFor.toLowerCase()) === false &&
    valB.toLowerCase().startsWith(searchFor.toLowerCase()) === true
  ) {
    return 1
  }

  if (
    valA.toLowerCase().includes(searchFor.toLowerCase()) === true &&
    valB.toLowerCase().includes(searchFor.toLowerCase()) === false
  ) {
    return -1
  }

  if (
    valA.toLowerCase().includes(searchFor.toLowerCase()) === false &&
    valB.toLowerCase().includes(searchFor.toLowerCase()) === true
  ) {
    return 1
  }

  // values are equal
  return 0
}

