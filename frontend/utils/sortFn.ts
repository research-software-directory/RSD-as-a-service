// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
    return localeSort(nameA,nameB,sortDir)
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

export function localeSort(a: string, b: string, sortDir: 'asc' | 'desc' = 'asc') {
  if (sortDir === 'desc') return b.localeCompare(a)
  // default is ascending
  return a.localeCompare(b)
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

  // exact match
  if (
    valA.toLowerCase() == searchFor.toLowerCase()
  ) {
    return -1
  }

  if (
    valB.toLowerCase() == searchFor.toLowerCase()
  ) {
    return 1
  }

  // get position of term, -1 = not found
  const posA = valA.toLowerCase().indexOf(searchFor.toLowerCase())
  const posB = valB.toLowerCase().indexOf(searchFor.toLowerCase())

  // both items contain the term
  if (posA > -1 && posB > -1) {
    // found in A closer to left
    if (posA < posB) return -1
    // found in B closer to left
    return 1
  }
  // found only in A
  if (posA > -1 && posB === -1) {
    return -1
  }
  // found only in B
  if (posA === -1 && posB > -1) {
    // found in B
    return 1
  }

  // no change of order
  return 0
}

