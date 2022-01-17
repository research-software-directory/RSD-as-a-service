/**
 * Array sorting functions for array of objects.
*/

export function sortOnStrProp(itemA:any, itemB:any, prop:string, sortDir:'asc'|'desc'='asc'){
  // ignore case
  const nameA = itemA[prop].toUpperCase()
  const nameB = itemB[prop].toUpperCase()

  return sortItems(nameA,nameB,sortDir)
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
